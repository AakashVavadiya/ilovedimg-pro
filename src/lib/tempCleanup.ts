import fs from "fs";
import path from "path";

export function startTempCleanup() {
  const scratchDir = path.join(process.cwd(), "scratch");
  
  console.log(`[TempCleanup] Initializing background file cleanup loop for: ${scratchDir}`);
  
  setInterval(() => {
    try {
      if (!fs.existsSync(scratchDir)) return;
      const files = fs.readdirSync(scratchDir);
      const now = Date.now();
      
      for (const file of files) {
        // Skip activity.log so logs are kept
        if (file === "activity.log") continue;

        const filePath = path.join(scratchDir, file);
        try {
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            // Delete if older than 15 minutes (900,000 ms)
            if (now - stat.mtimeMs > 15 * 60 * 1000) {
              fs.unlinkSync(filePath);
              console.log(`[TempCleanup] Deleted expired file: ${file}`);
            }
          }
        } catch (err) {
          // File might have already been deleted or locked
        }
      }
    } catch (err) {
      console.error("[TempCleanup] Error running automatic cleanup:", err);
    }
  }, 5 * 60 * 1000); // run every 5 minutes
}

// Start immediately on file import in server processes
if (typeof window === "undefined") {
  startTempCleanup();
}
