import fs from "fs";
import path from "path";

export interface LogEntry {
  timestamp: string;
  clientIp: string;
  tool: string;
  uploadSize: number;
  resolution: string;
  durationMs: number;
  status: "success" | "failure";
  error?: string;
}

export function logActivity(entry: LogEntry) {
  const logDir = path.join(process.cwd(), "scratch");
  const logPath = path.join(logDir, "activity.log");
  
  const cleanErr = entry.error ? ` ERR="${entry.error.replace(/"/g, "'")}"` : "";
  const logLine = `[${entry.timestamp}] IP=${entry.clientIp} TOOL=${entry.tool} SIZE=${entry.uploadSize}bytes RES=${entry.resolution} DURATION=${entry.durationMs}ms STATUS=${entry.status}${cleanErr}`;
  
  // Also log to standard console
  console.log(logLine);

  try {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(logPath, logLine + "\n", "utf-8");
  } catch (err) {
    console.error("Failed to append to activity log:", err);
  }
}
