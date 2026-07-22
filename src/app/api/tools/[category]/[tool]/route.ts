import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import { validateFileBuffer, getToolSizeLimit } from "@/lib/uploadSecurity";
import { rateLimitManager } from "@/lib/rateLimit";
import { downloadStore } from "@/lib/downloadStore";
import { logActivity } from "@/lib/activityLogger";

// Start temp cleanup loop on module loading
import "@/lib/tempCleanup";

function getPythonCommand(): string {
  if (process.env.PYTHON_PATH) {
    try {
      execSync(`"${process.env.PYTHON_PATH}" --version`, { stdio: "ignore" });
      return process.env.PYTHON_PATH;
    } catch (e) {
      return process.env.PYTHON_PATH;
    }
  }
  const commands = ["python", "python3", "py"];
  for (const cmd of commands) {
    try {
      execSync(`"${cmd}" --version`, { stdio: "ignore" });
      return cmd;
    } catch (e) {
      // Command failed
    }
  }
  throw new Error("Python was not found on this system path.");
}

function getContentTypeByExtension(ext: string): string {
  const mimeTypes: { [key: string]: string } = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
    ".gif": "image/gif",
    ".tiff": "image/tiff",
    ".zip": "application/zip",
  };
  return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
}

function getToolScript(tool: string): string {
  const mapping: { [key: string]: string } = {
    "compress-image": "compress_image.py",
    "resize-image": "resize_image.py",
    "crop-image": "crop_image.py",
    "convert-to-jpg": "convert_to_jpg.py",
    "convert-from-jpg": "convert_from_jpg.py",
    "upscale-image": "upscale_image.py",
    "remove-bg": "remove_bg.py",
    "watermark-image": "watermark_image.py",
    "rotate-image": "rotate_image.py",
    "html-to-image": "html_to_image.py",
    "blur-face": "blur_face.py",
  };
  return mapping[tool] || "";
}

function getOutputExtension(tool: string, targetFormat?: string): string {
  switch (tool) {
    case "convert-to-jpg":
      return ".jpg";
    case "convert-from-jpg": {
      const fmt = (targetFormat || "png").toLowerCase();
      if (fmt.includes("/")) return `.${fmt.split("/")[0]}`;
      return `.${fmt}`;
    }
    case "compress-image":
    case "resize-image":
    case "crop-image":
    case "upscale-image":
    case "remove-bg":
    case "watermark-image":
    case "rotate-image":
    case "blur-face":
      return ".png";
    case "html-to-image":
      return ".png";
    default:
      return ".bin";
  }
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (req as any).ip || "127.0.0.1";
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ category: string; tool: string }> }
) {
  const startTimestamp = Date.now();
  const { category, tool } = await context.params;
  const clientIp = getClientIp(req);
  
  // 1. Content-Length check to reject oversized uploads
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 105 * 1024 * 1024) {
    return NextResponse.json({ error: "Combined upload payload size is too large (max 100 MB)." }, { status: 413 });
  }

  // 2. Rate Limiting Check
  const rateLimitResult = rateLimitManager.checkRateLimit(req);
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ error: rateLimitResult.message }, { status: rateLimitResult.status });
  }

  const scriptName = getToolScript(tool);
  if (!scriptName) {
    return NextResponse.json({ error: `Tool '${tool}' is not recognized.` }, { status: 404 });
  }

  const workspaceRoot = process.cwd();
  const scratchDir = path.join(workspaceRoot, "scratch");
  const uniqueId = crypto.randomUUID();

  // Ensure scratch directory exists
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const createdPaths: string[] = [];
  let isJobAcquired = false;
  let uploadSize = 0;
  let parsedResolution = "unknown";

  try {
    // 3. Concurrency Queue entry
    await rateLimitManager.acquireJob(req);
    isJobAcquired = true;

    // Parse multipart upload
    let formData;
    try {
      formData = await req.formData();
    } catch (e) {
      return NextResponse.json({ error: "Malformed multipart form upload." }, { status: 400 });
    }

    const settings: any = {};

    // 4. Save and validate files
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const watermarkFile = formData.get("watermark_file") as File | null;

    const sizeLimit = getToolSizeLimit(tool);

    if (files && files.length > 0) {
      if (files.length > 10) {
        return NextResponse.json({ error: "Too many files uploaded. Maximum is 10 images per request." }, { status: 400 });
      }

      let combinedSize = 0;
      const inputs: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        combinedSize += buffer.length;

        // Size check
        if (buffer.length > sizeLimit) {
          const limitMb = sizeLimit / (1024 * 1024);
          return NextResponse.json({ error: `File size exceeds the limit of ${limitMb} MB for this tool.` }, { status: 400 });
        }

        // Integrity/Type check
        const valResult = validateFileBuffer(buffer, file.name);
        if (!valResult.isValid) {
          return NextResponse.json({ error: valResult.error }, { status: 400 });
        }

        const ext = path.extname(file.name).toLowerCase();
        // Use random UUID for input filenames (protect path traversal)
        const tempInPath = path.join(scratchDir, `input_${crypto.randomUUID()}${ext}`);
        
        await writeFile(tempInPath, buffer);
        inputs.push(tempInPath);
        createdPaths.push(tempInPath);
      }

      if (combinedSize > 100 * 1024 * 1024) {
        return NextResponse.json({ error: "Combined files size exceeds the limit of 100 MB." }, { status: 400 });
      }

      uploadSize = combinedSize;
      settings.inputs = inputs;
    } else if (singleFile) {
      const bytes = await singleFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      uploadSize = buffer.length;

      // Size check
      if (buffer.length > sizeLimit) {
        const limitMb = sizeLimit / (1024 * 1024);
        return NextResponse.json({ error: `File size exceeds the limit of ${limitMb} MB for this tool.` }, { status: 400 });
      }

      // Integrity/Type check
      const valResult = validateFileBuffer(buffer, singleFile.name);
      if (!valResult.isValid) {
        return NextResponse.json({ error: valResult.error }, { status: 400 });
      }

      const ext = path.extname(singleFile.name).toLowerCase();
      const tempInPath = path.join(scratchDir, `input_${crypto.randomUUID()}${ext}`);
      
      await writeFile(tempInPath, buffer);
      settings.input = tempInPath;
      createdPaths.push(tempInPath);
    } else if (tool !== "html-to-image") {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Save optional second file watermark
    if (watermarkFile) {
      const bytes = await watermarkFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const valResult = validateFileBuffer(buffer, watermarkFile.name);
      if (!valResult.isValid) {
        return NextResponse.json({ error: `Watermark image: ${valResult.error}` }, { status: 400 });
      }

      const ext = path.extname(watermarkFile.name).toLowerCase();
      const tempWmPath = path.join(scratchDir, `watermark_${crypto.randomUUID()}${ext}`);
      await writeFile(tempWmPath, buffer);
      settings.watermark_img = tempWmPath;
      createdPaths.push(tempWmPath);
    }

    // 5. Collect settings parameters
    for (const [key, value] of formData.entries()) {
      if (key !== "file" && key !== "files" && key !== "watermark_file") {
        if (typeof value === "string") {
          if (value === "true") settings[key] = true;
          else if (value === "false") settings[key] = false;
          else if (!isNaN(Number(value)) && value.trim() !== "") settings[key] = Number(value);
          else settings[key] = value;
        } else {
          settings[key] = value;
        }
      }
    }

    // 6. Define output path
    let inputExt = ".png";
    if (singleFile) {
      inputExt = path.extname(singleFile.name) || ".png";
    } else if (files && files.length > 0) {
      inputExt = path.extname(files[0].name) || ".png";
    }

    const targetFormat = settings.format || "png";
    let outputExt = getOutputExtension(tool, targetFormat);
    
    const isImageTool = [
      "compress-image",
      "resize-image",
      "crop-image",
      "upscale-image",
      "watermark-image",
      "rotate-image",
      "blur-face"
    ].includes(tool);

    if (isImageTool) {
      outputExt = inputExt;
      if (tool === "crop-image" && settings.shape && settings.shape !== "rectangle") {
        outputExt = ".png";
      }
    }
    
    if (tool === "compress-image" && settings.inputs && settings.inputs.length > 0) {
      outputExt = ".zip";
    }
    
    const secureOutputFilename = `output_${crypto.randomUUID()}${outputExt}`;
    const outputPath = path.join(scratchDir, secureOutputFilename);
    settings.output = outputPath;

    // Write settings JSON file (secure randomized filename)
    const settingsPath = path.join(scratchDir, `settings_${crypto.randomUUID()}.json`);
    await writeFile(settingsPath, JSON.stringify(settings, null, 2));
    createdPaths.push(settingsPath);

    // 7. Execute Python process with a strict 60 seconds timeout limit
    const pythonCmd = getPythonCommand();
    const scriptPath = path.join(workspaceRoot, "scripts", scriptName);

    let stdoutStr = "";
    let execSuccess = true;
    try {
      const output = execSync(`"${pythonCmd}" "${scriptPath}" "${settingsPath}"`, {
        stdio: "pipe",
        timeout: 60000, // 60 seconds task timeout
        killSignal: "SIGKILL"
      });
      stdoutStr = output.toString();
    } catch (execError: any) {
      execSuccess = false;
      stdoutStr = execError.stdout ? execError.stdout.toString() : "";
      const stderrStr = execError.stderr ? execError.stderr.toString() : "";
      
      console.error("Python Execution Error Logs:");
      console.error("STDOUT:", stdoutStr);
      console.error("STDERR:", stderrStr);
      
      // If validation printed an error in python stdout, return it to client
      if (stdoutStr.includes("Error:")) {
        const errorLine = stdoutStr.split("\n").find(line => line.startsWith("Error:"));
        if (errorLine) {
          return NextResponse.json({ error: errorLine.replace("Error:", "").trim() }, { status: 400 });
        }
      }
    }

    if (!execSuccess) {
      throw new Error("Local processing engine crashed or timed out.");
    }

    if (!fs.existsSync(outputPath)) {
      throw new Error("Output image was not generated by the engine.");
    }

    // Parse image resolution printed by python script if present
    const resMatch = /RESOLUTION:\s*(\d+x\d+)/i.exec(stdoutStr);
    if (resMatch && resMatch[1]) {
      parsedResolution = resMatch[1];
    }

    // 8. Register output file in DownloadStore under a random secure token
    const secureToken = crypto.randomUUID();
    
    const origFilename = singleFile ? singleFile.name : (files && files[0] ? files[0].name : "processed");
    const nameWithoutExt = path.parse(origFilename).name;
    const downloadFilename = `${nameWithoutExt}_processed${outputExt}`;

    downloadStore.set(secureToken, {
      filePath: outputPath,
      filename: downloadFilename,
      mimeType: getContentTypeByExtension(outputExt),
      createdAt: Date.now(),
    });

    // Cleanup input files immediately (keep the output file in scratch, downloadStore will manage its deletion)
    const inputsToClean = createdPaths.filter(p => p !== outputPath);
    cleanupFiles(inputsToClean);

    const durationMs = Date.now() - startTimestamp;

    // Log Activity success
    logActivity({
      timestamp: new Date().toISOString(),
      clientIp,
      tool: `${category}/${tool}`,
      uploadSize,
      resolution: parsedResolution,
      durationMs,
      status: "success",
    });

    return NextResponse.json({
      success: true,
      downloadUrl: `/api/download?token=${secureToken}`,
      filename: downloadFilename,
      size: fs.statSync(outputPath).size
    });

  } catch (error: any) {
    const durationMs = Date.now() - startTimestamp;
    const errMessage = error.message || "Unknown processing error";

    // Log Activity failure
    logActivity({
      timestamp: new Date().toISOString(),
      clientIp,
      tool: `${category}/${tool}`,
      uploadSize,
      resolution: parsedResolution,
      durationMs,
      status: "failure",
      error: errMessage
    });

    // Cleanup all files created in case of failure
    cleanupFiles(createdPaths);

    // Expose validation messages, but mask engine exceptions to protect path leaks
    const userErrMsg = errMessage.includes("limit") || errMessage.includes("Queue") || errMessage.includes("validation")
      ? errMessage
      : "Unable to process the image.";

    return NextResponse.json(
      { error: userErrMsg },
      { status: error.message && error.message.includes("limit") ? 400 : 500 }
    );
  } finally {
    // 9. Release Job Slot in Concurrency manager
    if (isJobAcquired) {
      rateLimitManager.releaseJob(req);
    }
  }
}

async function cleanupFiles(paths: string[]) {
  for (const p of paths) {
    try {
      if (fs.existsSync(p)) {
        await unlink(p);
      }
    } catch (err) {
      // Already cleaned up
    }
  }
}
