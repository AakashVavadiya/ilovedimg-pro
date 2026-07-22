import sys
import json
import os
import subprocess

def install_and_import(package, pip_name=None):
    if pip_name is None:
        pip_name = package
    try:
        __import__(package)
    except ImportError:
        print(f"Installing {pip_name}...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name])
        except Exception as e:
            print(f"Failed to install {pip_name} via standard pip: {e}")
            sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print("Usage: python convert_to_jpg.py <settings_json_path>")
        sys.exit(1)

    settings_path = sys.argv[1]
    if not os.path.exists(settings_path):
        print(f"Settings file not found: {settings_path}")
        sys.exit(1)

    with open(settings_path, "r", encoding="utf-8") as f:
        settings = json.load(f)

    input_path = settings.get("input", "")
    output = settings.get("output", "")

    if not input_path or not output:
        print("Error: 'input' and 'output' must be provided in settings.")
        sys.exit(1)

    install_and_import("PIL", "pillow")
    from PIL import Image
    from image_validator import validate_image_file

    try:
        validate_image_file(input_path, max_size_mb=25)
        print(f"Converting image: {input_path} to JPEG: {output}")
        img = Image.open(input_path)
        
        # Flatten transparent images
        if img.mode in ("RGBA", "LA", "P"):
            img_rgba = img.convert("RGBA")
            background = Image.new("RGB", img_rgba.size, (255, 255, 255))
            background.paste(img_rgba, mask=img_rgba.split()[3])
            img = background
        else:
            img = img.convert("RGB")
            
        # Ensure output folder exists
        os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
        img.save(output, "JPEG", quality=90, optimize=True)
        print("Success")
    except Exception as e:
        print(f"Error converting image to JPG: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
