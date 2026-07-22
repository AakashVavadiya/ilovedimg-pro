import sys
import json
import os


def main():
    if len(sys.argv) < 2:
        print("Usage: python resize_image.py <settings_json_path>")
        sys.exit(1)

    settings_path = sys.argv[1]
    if not os.path.exists(settings_path):
        print(f"Settings file not found: {settings_path}")
        sys.exit(1)

    with open(settings_path, "r", encoding="utf-8") as f:
        settings = json.load(f)

    input_path = settings.get("input", "")
    output = settings.get("output", "")
    width = settings.get("width")
    height = settings.get("height")
    maintain_aspect = settings.get("maintain_aspect", True)

    if not input_path or not output:
        print("Error: 'input' and 'output' must be provided in settings.")
        sys.exit(1)

    try:
        from PIL import Image
    except ImportError:
        print("Error: Required package 'Pillow' is missing. Please install dependencies in requirements.txt.")
        sys.exit(1)
    from image_validator import validate_image_file

    try:
        validate_image_file(input_path, max_size_mb=25)
        print(f"Resizing image: {input_path} to {output}")
        img = Image.open(input_path)
        orig_w, orig_h = img.size

        # Parse sizes
        target_w = int(width) if width else None
        target_h = int(height) if height else None

        if target_w and not target_h:
            if maintain_aspect:
                target_h = int(orig_h * (target_w / orig_w))
            else:
                target_h = orig_h
        elif target_h and not target_w:
            if maintain_aspect:
                target_w = int(orig_w * (target_h / orig_h))
            else:
                target_w = orig_w
        elif not target_w and not target_h:
            target_w = orig_w
            target_h = orig_h
        elif target_w and target_h:
            if maintain_aspect:
                # scale to fit in the box
                ratio = min(target_w / orig_w, target_h / orig_h)
                target_w = int(orig_w * ratio)
                target_h = int(orig_h * ratio)

        img_resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Ensure output folder exists
        os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
        ext = os.path.splitext(output)[1].lower()
        if ext in (".jpg", ".jpeg"):
            if img_resized.mode in ("RGBA", "LA", "P"):
                img_rgba = img_resized.convert("RGBA")
                background = Image.new("RGB", img_rgba.size, (255, 255, 255))
                background.paste(img_rgba, mask=img_rgba.split()[3])
                img_resized = background
            else:
                img_resized = img_resized.convert("RGB")
        img_resized.save(output)
        print("Success")
    except Exception as e:
        print(f"Error resizing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
