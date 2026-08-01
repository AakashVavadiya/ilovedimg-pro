import sys
import json
import os


def main():
    if len(sys.argv) < 2:
        print("Usage: python convert_from_jpg.py <settings_json_path>")
        sys.exit(1)

    settings_path = sys.argv[1]
    if not os.path.exists(settings_path):
        print(f"Settings file not found: {settings_path}")
        sys.exit(1)

    with open(settings_path, "r", encoding="utf-8") as f:
        settings = json.load(f)

    input_path = settings.get("input", "")
    output = settings.get("output", "")
    target_format = settings.get("format", "PNG").upper()

    if not input_path or not output:
        print("Error: 'input' and 'output' must be provided in settings.")
        sys.exit(1)

    try:
        from PIL import Image
    except ImportError:
        print("Error: Required package 'Pillow' is missing. Please install dependencies in requirements.txt.")
        sys.exit(1)

    if target_format in ("HEIC", "HEIF", "HEIC/HEIF", "AVIF"):
        try:
            import pillow_heif
            pillow_heif.register_heif_opener()
            pillow_heif.register_avif_opener()
        except ImportError:
            print("Warning: Package 'pillow_heif' is not installed. HEIC/AVIF support may be limited.")
        except Exception as e:
            print(f"HEIF support registration failed: {e}")

    try:
        from image_validator import validate_image_file
        validate_image_file(input_path, max_size_mb=40)
        print(f"Converting JPG image: {input_path} to format {target_format} at {output}")
        img = Image.open(input_path)
        
        os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
        
        if target_format == "SVG":
            import base64
            with open(input_path, "rb") as f_in:
                b64_data = base64.b64encode(f_in.read()).decode("utf-8")
            w, h = img.size
            svg_content = f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg">\n'
            svg_content += f'  <image width="{w}" height="{h}" href="data:image/jpeg;base64,{b64_data}" />\n'
            svg_content += '</svg>'
            with open(output, "w", encoding="utf-8") as f_out:
                f_out.write(svg_content)
        else:
            format_map = {
                "PNG": "PNG",
                "WEBP": "WEBP",
                "BMP": "BMP",
                "GIF": "GIF",
                "TIFF": "TIFF",
                "ICO": "ICO",
                "AVIF": "AVIF",
                "HEIC": "HEIF",
                "HEIF": "HEIF",
                "HEIC/HEIF": "HEIF",
            }
            pil_format = format_map.get(target_format, "PNG")
            
            if pil_format == "ICO" and (img.size[0] > 256 or img.size[1] > 256):
                img.thumbnail((256, 256), Image.Resampling.LANCZOS)
                
            img.save(output, pil_format)
            
        print("Success")
    except Exception as e:
        print(f"Error converting from JPG: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
