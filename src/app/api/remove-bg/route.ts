import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

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
      // Command failed, try next
    }
  }
  throw new Error("Python was not found on this system path. If Python is installed, please set the PYTHON_PATH environment variable.");
}

export async function POST(req: NextRequest) {
  let inputPath = "";
  let outputPath = "";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueId = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const workspaceRoot = process.cwd();
    const scratchDir = path.join(workspaceRoot, "scratch");
    
    // Ensure scratch directory exists
    if (!fs.existsSync(scratchDir)) {
      fs.mkdirSync(scratchDir, { recursive: true });
    }

    inputPath = path.join(scratchDir, `input_${uniqueId}.png`);
    outputPath = path.join(scratchDir, `output_${uniqueId}.png`);

    // Write input image to scratch directory
    await writeFile(inputPath, buffer);

    // Get correct python command
    const pythonCmd = getPythonCommand();
    const scriptPath = path.join(workspaceRoot, "scripts", "remove_bg.py");

    console.log(`Executing background removal script: ${pythonCmd} "${scriptPath}" "${inputPath}" "${outputPath}"`);
    execSync(`"${pythonCmd}" "${scriptPath}" "${inputPath}" "${outputPath}"`, {
      stdio: "inherit",
    });

    if (!fs.existsSync(outputPath)) {
      throw new Error("Python background removal failed to create output file.");
    }

    // Read the output transparent PNG
    const outputBuffer = fs.readFileSync(outputPath);

    // Clean up temporary files asynchronously
    try {
      await unlink(inputPath);
      await unlink(outputPath);
    } catch (err) {
      console.error("Error cleaning up temp background removal files:", err);
    }

    return new Response(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });

  } catch (error: any) {
    console.error("Error in AI Background Removal Route:", error);
    
    // Cleanup files if they were created and still exist
    try {
      if (inputPath && fs.existsSync(inputPath)) await unlink(inputPath);
      if (outputPath && fs.existsSync(outputPath)) await unlink(outputPath);
    } catch (cleanupErr) {
      // ignore
    }

    return NextResponse.json(
      { error: "Unable to process the image." },
      { status: 500 }
    );
  }
}
