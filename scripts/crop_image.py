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
        print("Usage: python crop_image.py <settings_json_path>")
        sys.exit(1)

    settings_path = sys.argv[1]
    if not os.path.exists(settings_path):
        print(f"Settings file not found: {settings_path}")
        sys.exit(1)

    with open(settings_path, "r", encoding="utf-8") as f:
        settings = json.load(f)

    input_path = settings.get("input", "")
    output = settings.get("output", "")
    x = settings.get("x")
    y = settings.get("y")
    width = settings.get("width")
    height = settings.get("height")
    shape = settings.get("shape", "rectangle") # rectangle, circle, triangle, rounded_rect, star

    if not input_path or not output or x is None or y is None or not width or not height:
        print("Error: 'input', 'output', 'x', 'y', 'width', and 'height' must be provided in settings.")
        sys.exit(1)

    install_and_import("PIL", "pillow")
    from PIL import Image, ImageDraw
    from image_validator import validate_image_file
    import math

    try:
        validate_image_file(input_path, max_size_mb=25)
        print(f"Cropping image: {input_path} to {output} (shape: {shape})")
        img = Image.open(input_path)
        
        left = int(x)
        top = int(y)
        right = left + int(width)
        bottom = top + int(height)
        
        # Crop boundary box first
        cropped_img = img.crop((left, top, right, bottom))
        w, h = cropped_img.size
        
        # Apply shape mask if not default rectangle
        if shape != "rectangle":
            cropped_img = cropped_img.convert("RGBA")
            mask = Image.new("L", (w, h), 0)
            draw = ImageDraw.Draw(mask)
            
            if shape == "circle":
                draw.ellipse((0, 0, w, h), fill=255)
            elif shape == "triangle":
                draw.polygon([(w // 2, 0), (w, h), (0, h)], fill=255)
            elif shape == "rounded_rect":
                radius_percent = settings.get("radius_percent", 15)
                try:
                    radius_percent = float(radius_percent)
                except Exception:
                    radius_percent = 15.0

                def to_bool(val):
                    if isinstance(val, str):
                        return val.lower() in ("true", "1", "yes")
                    return bool(val)

                round_tl = to_bool(settings.get("round_tl", True))
                round_tr = to_bool(settings.get("round_tr", True))
                round_bl = to_bool(settings.get("round_bl", True))
                round_br = to_bool(settings.get("round_br", True))

                radius = int(min(w, h) * (radius_percent / 100.0))
                radius = max(1, radius)
                corners = (round_tl, round_tr, round_br, round_bl)
                draw.rounded_rectangle((0, 0, w, h), radius=radius, fill=255, corners=corners)
            elif shape == "star":
                points = []
                cx, cy = w // 2, h // 2
                r_outer = min(w, h) // 2
                r_inner = r_outer // 2.5
                for i in range(10):
                    r = r_outer if i % 2 == 0 else r_inner
                    angle = i * math.pi / 5 - math.pi / 2
                    points.append((cx + int(r * math.cos(angle)), cy + int(r * math.sin(angle))))
                draw.polygon(points, fill=255)
                
            cropped_img.putalpha(mask)
            
        # Ensure output folder exists
        os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
        
        if shape != "rectangle" and output.lower().endswith((".jpg", ".jpeg")):
            output = os.path.splitext(output)[0] + ".png"
            
        ext = os.path.splitext(output)[1].lower()
        if ext in (".jpg", ".jpeg"):
            if cropped_img.mode in ("RGBA", "LA", "P"):
                img_rgba = cropped_img.convert("RGBA")
                background = Image.new("RGB", img_rgba.size, (255, 255, 255))
                background.paste(img_rgba, mask=img_rgba.split()[3])
                cropped_img = background
            else:
                cropped_img = cropped_img.convert("RGB")

        cropped_img.save(output, "PNG" if shape != "rectangle" else None)
        print("Success")
    except Exception as e:
        print(f"Error cropping image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
