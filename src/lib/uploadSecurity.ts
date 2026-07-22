import path from "path";

export interface ValidationResult {
  isValid: boolean;
  mimeType?: string;
  format?: string;
  error?: string;
}

const ALLOWED_SIGNATURES = [
  {
    format: "jpeg",
    mime: "image/jpeg",
    exts: [".jpg", ".jpeg"],
    check: (buf: Buffer) => buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF
  },
  {
    format: "png",
    mime: "image/png",
    exts: [".png"],
    check: (buf: Buffer) => buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47
  },
  {
    format: "gif",
    mime: "image/gif",
    exts: [".gif"],
    check: (buf: Buffer) => buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38
  },
  {
    format: "webp",
    mime: "image/webp",
    exts: [".webp"],
    check: (buf: Buffer) => 
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && // RIFF
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50   // WEBP
  },
  {
    format: "bmp",
    mime: "image/bmp",
    exts: [".bmp"],
    check: (buf: Buffer) => buf[0] === 0x42 && buf[1] === 0x4D // BM
  },
  {
    format: "tiff",
    mime: "image/tiff",
    exts: [".tiff", ".tif"],
    check: (buf: Buffer) => 
      (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2A && buf[3] === 0x00) || // II*
      (buf[0] === 0x4D && buf[1] === 0x4D && buf[2] === 0x00 && buf[3] === 0x2A)    // MM*
  }
];

/**
 * Checks if a GIF is animated by scanning for the Graphic Control Extension (0x21 0xF9)
 * occurring more than once.
 */
function isAnimatedGif(buffer: Buffer): boolean {
  let gceCount = 0;
  for (let i = 0; i < buffer.length - 2; i++) {
    if (buffer[i] === 0x21 && buffer[i + 1] === 0xF9) {
      gceCount++;
      if (gceCount > 1) return true;
    }
  }
  return false;
}

export function validateFileBuffer(buffer: Buffer, filename: string): ValidationResult {
  if (buffer.length === 0) {
    return { isValid: false, error: "Empty file uploaded." };
  }

  const ext = path.extname(filename).toLowerCase();
  if (ext === ".html" || ext === ".htm") {
    return {
      isValid: true,
      mimeType: "text/html",
      format: "html"
    };
  }

  // 1. Verify header signature (Magic Numbers)
  let matchedSig = null;
  for (const sig of ALLOWED_SIGNATURES) {
    if (sig.check(buffer)) {
      matchedSig = sig;
      break;
    }
  }

  if (!matchedSig) {
    return { isValid: false, error: "Unsupported or invalid image file format. Only JPG, JPEG, PNG, WEBP, BMP, TIFF, static GIF, and HTML (.html, .htm) files are allowed." };
  }

  // 2. Reject renamed files: check that extension matches actual header format
  if (!matchedSig.exts.includes(ext)) {
    return { isValid: false, error: `File type mismatch: File extension '${ext}' does not match the actual image header format '${matchedSig.format}'.` };
  }

  // 3. Reject animated GIFs (Static GIF only)
  if (matchedSig.format === "gif" && isAnimatedGif(buffer)) {
    return { isValid: false, error: "Animated GIF files are not allowed. Please upload a static GIF." };
  }

  return {
    isValid: true,
    mimeType: matchedSig.mime,
    format: matchedSig.format
  };
}

export function getToolSizeLimit(tool: string): number {
  switch (tool) {
    case "upscale-image":
      return 10 * 1024 * 1024; // 10 MB
    case "remove-bg":
      return 15 * 1024 * 1024; // 15 MB
    default:
      return 25 * 1024 * 1024; // 25 MB
  }
}
