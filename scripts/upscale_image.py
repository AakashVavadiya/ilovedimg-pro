import sys
import json
import os


def main():
    if len(sys.argv) < 2:
        print("Usage: python upscale_image.py <settings_json_path>")
        sys.exit(1)

    settings_path = sys.argv[1]
    if not os.path.exists(settings_path):
        print(f"Settings file not found: {settings_path}")
        sys.exit(1)

    with open(settings_path, "r", encoding="utf-8") as f:
        settings = json.load(f)

    input_path = settings.get("input", "")
    output = settings.get("output", "")
    scale = float(settings.get("scale", 2))
    filter_name = settings.get("filter", "lanczos").lower()
    sharpen_factor = float(settings.get("sharpen", 1.0))

    if not input_path or not output:
        print("Error: 'input' and 'output' must be provided in settings.")
        sys.exit(1)

    try:
        from PIL import Image, ImageEnhance
    except ImportError:
        print("Error: Required package 'Pillow' is missing. Please install dependencies in requirements.txt.")
        sys.exit(1)

    try:
        from image_validator import validate_image_file
        validate_image_file(input_path, max_size_mb=10)
        print(f"Upscaling image: {input_path} by {scale}x (filter: {filter_name}, sharpen: {sharpen_factor})")
        img = Image.open(input_path)
        orig_w, orig_h = img.size
        
        target_w = int(orig_w * scale)
        target_h = int(orig_h * scale)
        
        filter_map = {
            "lanczos": Image.Resampling.LANCZOS,
            "bicubic": Image.Resampling.BICUBIC,
            "bilinear": Image.Resampling.BILINEAR,
            "nearest": Image.Resampling.NEAREST,
        }
        pil_filter = filter_map.get(filter_name, Image.Resampling.LANCZOS)
        
        img_upscaled = img.resize((target_w, target_h), pil_filter)
        
        if sharpen_factor != 1.0:
            enhancer = ImageEnhance.Sharpness(img_upscaled)
            img_upscaled = enhancer.enhance(sharpen_factor)
            
        os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
        ext = os.path.splitext(output)[1].lower()
        if ext in (".jpg", ".jpeg"):
            if img_upscaled.mode in ("RGBA", "LA", "P"):
                img_rgba = img_upscaled.convert("RGBA")
                background = Image.new("RGB", img_rgba.size, (255, 255, 255))
                background.paste(img_rgba, mask=img_rgba.split()[3])
                img_upscaled = background
            else:
                img_upscaled = img_upscaled.convert("RGB")
        img_upscaled.save(output)
        print("Success")
    except Exception as e:
        print(f"Error upscaling image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
