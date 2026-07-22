import { NextRequest } from "next/server";
import os from "os";

interface IPStats {
  minuteCount: number;
  hourCount: number;
  dayCount: number;
  lastResetMinute: number;
  lastResetHour: number;
  lastResetDay: number;
  blockedUntil: number;
  activeJobs: number;
}

class RateLimitManager {
  private stats = new Map<string, IPStats>();
  private activeJobsTotal = 0;
  
  // Concurrency queue
  private queue: { ip: string; resolve: (val: boolean) => void; reject: (err: any) => void; timestamp: number }[] = [];

  constructor() {
    // Start background loops
    if (typeof window === "undefined") {
      setInterval(() => this.cleanupStats(), 60 * 60 * 1000); // clear old stats hourly
      setInterval(() => this.processQueue(), 500); // check queue every 500ms
    }
  }

  private getIP(req: NextRequest): string {
    const forwarded = req.headers.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }
    return (req as any).ip || "127.0.0.1";
  }

  private getStats(ip: string): IPStats {
    const now = Date.now();
    let s = this.stats.get(ip);
    if (!s) {
      s = {
        minuteCount: 0,
        hourCount: 0,
        dayCount: 0,
        lastResetMinute: now,
        lastResetHour: now,
        lastResetDay: now,
        blockedUntil: 0,
        activeJobs: 0,
      };
      this.stats.set(ip, s);
    }
    
    // Reset limits based on elapsed time
    if (now - s.lastResetMinute > 60 * 1000) {
      s.minuteCount = 0;
      s.lastResetMinute = now;
    }
    if (now - s.lastResetHour > 60 * 60 * 1000) {
      s.hourCount = 0;
      s.lastResetHour = now;
    }
    if (now - s.lastResetDay > 24 * 60 * 60 * 1000) {
      s.dayCount = 0;
      s.lastResetDay = now;
    }
    
    return s;
  }

  checkRateLimit(req: NextRequest): { allowed: boolean; status: number; message?: string } {
    const ip = this.getIP(req);
    const s = this.getStats(ip);
    const now = Date.now();
    
    if (s.blockedUntil > now) {
      const remainingSec = Math.ceil((s.blockedUntil - now) / 1000);
      return {
        allowed: false,
        status: 429,
        message: `Too many requests. Your IP is temporarily blocked. Try again in ${remainingSec} seconds.`,
      };
    }

    // Check limits
    if (s.minuteCount >= 30 || s.hourCount >= 200 || s.dayCount >= 1000) {
      s.blockedUntil = now + 30 * 60 * 1000; // Block for 30 minutes
      return {
        allowed: false,
        status: 429,
        message: "Rate limit exceeded. Your IP has been temporarily blocked for 30 minutes.",
      };
    }

    // Increment request counters
    s.minuteCount++;
    s.hourCount++;
    s.dayCount++;

    return { allowed: true, status: 200 };
  }

  isCpuHigh(): boolean {
    return globalCPUUsage > 80;
  }

  isMemoryHigh(): boolean {
    const memUsed = process.memoryUsage().heapUsed; // bytes
    const memUsedGb = memUsed / (1024 * 1024 * 1024);
    return memUsedGb > 6.0; // 6 GB limit
  }

  async acquireJob(req: NextRequest): Promise<boolean> {
    const ip = this.getIP(req);
    const s = this.getStats(ip);
    
    if (s.activeJobs >= 2) {
      throw new Error("Concurrency limit reached: Max 2 parallel jobs per IP.");
    }

    if (this.isCpuHigh()) {
      throw new Error("Server is currently under heavy load (CPU > 80%). Please try again shortly.");
    }

    if (this.isMemoryHigh()) {
      throw new Error("Server is currently under heavy load (Memory limit reached). Please try again shortly.");
    }

    if (this.activeJobsTotal >= 8) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          ip,
          resolve,
          reject,
          timestamp: Date.now(),
        });
      });
    }

    s.activeJobs++;
    this.activeJobsTotal++;
    return true;
  }

  releaseJob(req: NextRequest) {
    const ip = this.getIP(req);
    const s = this.getStats(ip);
    
    if (s.activeJobs > 0) s.activeJobs--;
    if (this.activeJobsTotal > 0) this.activeJobsTotal--;
    
    this.processQueue();
  }

  private processQueue() {
    const now = Date.now();
    
    // Cancel queue entries older than 60 seconds
    this.queue = this.queue.filter((q) => {
      if (now - q.timestamp > 60 * 1000) {
        q.reject(new Error("Queue timeout: Processing request expired after 60 seconds waiting."));
        return false;
      }
      return true;
    });

    // Assign jobs to waiting queue requests
    while (this.activeJobsTotal < 8 && this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        const s = this.getStats(next.ip);
        if (s.activeJobs >= 2) {
          next.reject(new Error("Concurrency limit reached: Max 2 parallel jobs per IP."));
          continue;
        }
        s.activeJobs++;
        this.activeJobsTotal++;
        next.resolve(true);
      }
    }
  }

  private cleanupStats() {
    const now = Date.now();
    for (const [ip, s] of this.stats.entries()) {
      if (now - s.lastResetDay > 24 * 60 * 60 * 1000) {
        this.stats.delete(ip);
      }
    }
  }
}

// Track CPU Usage via tick updates
let globalCPUUsage = 0;
function monitorCPU() {
  let lastCpuUsage = process.cpuUsage();
  let lastTime = Date.now();

  setInterval(() => {
    const now = Date.now();
    const cpuUsage = process.cpuUsage(lastCpuUsage);
    
    const timeDiffMs = now - lastTime;
    const systemTimeUs = cpuUsage.system;
    const userTimeUs = cpuUsage.user;
    
    const totalCpuTimeMs = (systemTimeUs + userTimeUs) / 1000;
    const cores = os.cpus().length || 1;
    const percent = (totalCpuTimeMs / (timeDiffMs * cores)) * 100;
    
    globalCPUUsage = Math.min(100, Math.max(0, percent));
    
    lastCpuUsage = process.cpuUsage();
    lastTime = now;
  }, 2000);
}

if (typeof window === "undefined") {
  monitorCPU();
}

const globalForRateLimit = global as unknown as { rateLimitManager?: RateLimitManager };
export const rateLimitManager = globalForRateLimit.rateLimitManager || new RateLimitManager();
if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.rateLimitManager = rateLimitManager;
}
