import { NextRequest } from "next/server";
import { downloadStore } from "@/lib/downloadStore";
import fs from "fs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return new Response("Missing download token", { status: 400 });
  }

  const info = downloadStore.get(token);
  if (!info) {
    return new Response("Invalid or expired download link", { status: 410 });
  }

  if (!fs.existsSync(info.filePath)) {
    // Clean up mapping if file is missing
    downloadStore.delete(token);
    return new Response("Requested processed file not found on server", { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(info.filePath);
    
    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": info.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(info.filename)}"`,
        // Prevent browser caching of temporary processed files
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err) {
    console.error(`[DownloadRoute] Error reading/streaming file for token ${token}:`, err);
    return new Response("Unable to retrieve file.", { status: 500 });
  }
}
