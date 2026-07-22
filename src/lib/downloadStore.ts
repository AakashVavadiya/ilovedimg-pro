import fs from "fs";

interface TokenInfo {
  filePath: string;
  filename: string;
  mimeType: string;
  createdAt: number;
}

class DownloadStore {
  private tokens = new Map<string, TokenInfo>();

  constructor() {
    // Run cleanup loop every 5 minutes to sweep expired mappings
    if (typeof window === "undefined") {
      setInterval(() => this.cleanupExpired(), 5 * 60 * 1000);
    }
  }

  set(token: string, info: TokenInfo) {
    this.tokens.set(token, info);
  }

  get(token: string): TokenInfo | undefined {
    return this.tokens.get(token);
  }

  delete(token: string) {
    const info = this.tokens.get(token);
    if (info) {
      this.tokens.delete(token);
      try {
        if (fs.existsSync(info.filePath)) {
          fs.unlinkSync(info.filePath);
          console.log(`[DownloadStore] Deleted output file: ${info.filePath}`);
        }
      } catch (err) {
        console.error("[DownloadStore] Error deleting file during token removal:", err);
      }
    }
  }

  cleanupExpired() {
    const now = Date.now();
    for (const [token, info] of this.tokens.entries()) {
      // Delete after 30 minutes
      if (now - info.createdAt > 30 * 60 * 1000) {
        console.log(`[DownloadStore] Token expired for: ${info.filename}`);
        this.delete(token);
      }
    }
  }
}

const globalForStore = global as unknown as { downloadStore?: DownloadStore };
export const downloadStore = globalForStore.downloadStore || new DownloadStore();
if (process.env.NODE_ENV !== "production") {
  globalForStore.downloadStore = downloadStore;
}
