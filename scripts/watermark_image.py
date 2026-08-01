import sys
import json
import os


def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = "".join([c*2 for c in hex_str])
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def main():
    if len(sys.argv) < 2:
        print("Usage: python watermark_image.py <settings_json_path>")
        sys.exit(1)

    settings_path = sys.argv[1]
    if not os.path.exists(settings_path):
        print(f"Settings file not found: {settings_path}")
        sys.exit(1)

    with open(settings_path, "r", encoding="utf-8") as f:
        settings = json.load(f)

    input_path = settings.get("input", "")
    output = settings.get("output", "")
    wm_type = settings.get("type", "text")
    wm_text = settings.get("text", "Watermark")
    font_size = int(settings.get("font_size", 36))
    color_hex = settings.get("color", "#ffffff")
    opacity = float(settings.get("opacity", 0.5))
    position = settings.get("position", "center")
    rotation = float(settings.get("rotation", 0))
    wm_img_path = settings.get("watermark_img", "")

    if not input_path or not output:
        print("Error: 'input' and 'output' must be provided in settings.")
        sys.exit(1)

    try:
        from PIL import Image, ImageDraw, ImageFont, ImageEnhance
    except ImportError:
        print("Error: Required package 'Pillow' is missing. Please install dependencies in requirements.txt.")
        sys.exit(1)

    try:
        from image_validator import validate_image_file
        validate_image_file(input_path, max_size_mb=40)
        if wm_type == "image" and wm_img_path:
            validate_image_file(wm_img_path, max_size_mb=40)
            
        print(f"Applying watermark to: {input_path}")
        base_img = Image.open(input_path).convert("RGBA")
        width, height = base_img.size
        
        overlay = Image.new("RGBA", base_img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        
        rgb_color = hex_to_rgb(color_hex)
        rgba_color = rgb_color + (int(255 * opacity),)

        if wm_type == "text":
            font = None
            # Scale the font size relative to a 400px height preview
            scaled_font_size = max(12, int(font_size * (height / 400.0)))
            
            # Try loading common fonts
            for font_name in ["arial.ttf", "Arial.ttf", "C:/Windows/Fonts/arial.ttf", "C:/Windows/Fonts/Arial.ttf", "Helvetica.ttc", "DejaVuSans.ttf"]:
                try:
                    font = ImageFont.truetype(font_name, scaled_font_size)
                    break
                except IOError:
                    continue
            
            if font is None:
                try:
                    font = ImageFont.load_default(size=scaled_font_size)
                except TypeError:
                    font = ImageFont.load_default()
            
            try:
                bbox = draw.textbbox((0, 0), wm_text, font=font)
                text_w = bbox[2] - bbox[0]
                text_h = bbox[3] - bbox[1]
            except AttributeError:
                text_w, text_h = draw.textsize(wm_text, font=font)

            pad_w = text_w + int(20 * (height / 400.0))
            pad_h = text_h + int(20 * (height / 400.0))
            txt_canvas = Image.new("RGBA", (pad_w, pad_h), (0, 0, 0, 0))
            txt_draw = ImageDraw.Draw(txt_canvas)
            
            # Draw text with solid color (alpha 255) and a stroke for high quality
            solid_color = rgb_color + (255,)
            stroke_width = max(1, scaled_font_size // 30)
            txt_draw.text((int(10 * (height / 400.0)), int(10 * (height / 400.0))), 
                          wm_text, font=font, fill=solid_color, 
                          stroke_width=stroke_width, stroke_fill=solid_color)
            
            if rotation != 0:
                rotated_txt = txt_canvas.rotate(rotation, expand=True, resample=Image.Resampling.BICUBIC)
            else:
                rotated_txt = txt_canvas
                
            rot_w, rot_h = rotated_txt.size
            
            # Extract binary mask and apply opacity to image pixels
            mask = rotated_txt.split()[3]
            alpha = ImageEnhance.Brightness(mask).enhance(opacity)
            rotated_txt.putalpha(alpha)
            
            margin = int(20 * (height / 400.0))
            if position == "top_left":
                x, y = margin, margin
            elif position == "top_right":
                x, y = width - rot_w - margin, margin
            elif position == "bottom_left":
                x, y = margin, height - rot_h - margin
            elif position == "bottom_right":
                x, y = width - rot_w - margin, height - rot_h - margin
            else: # center
                x, y = (width - rot_w) // 2, (height - rot_h) // 2
            
            overlay.paste(rotated_txt, (x, y), mask=mask)
            
        elif wm_type == "image" and wm_img_path and os.path.exists(wm_img_path):
            wm_img = Image.open(wm_img_path).convert("RGBA")
            
            # Scale the watermark image relative to the preview size
            # The preview max size is 140px on a 400px height preview
            scale_factor = height / 400.0
            target_max_size = int(140 * scale_factor)
            
            wm_w, wm_h = wm_img.size
            ratio = min(target_max_size / wm_w, target_max_size / wm_h)
            
            # Also respect base image maximum limits (e.g., max 50% of the image size)
            max_w = width * 0.5
            max_h = height * 0.5
            if wm_w * ratio > max_w or wm_h * ratio > max_h:
                ratio = min(max_w / wm_w, max_h / wm_h)
                
            wm_w = max(10, int(wm_w * ratio))
            wm_h = max(10, int(wm_h * ratio))
            wm_img = wm_img.resize((wm_w, wm_h), Image.Resampling.LANCZOS)
            
            if rotation != 0:
                wm_img = wm_img.rotate(rotation, expand=True, resample=Image.Resampling.BICUBIC)
                
            rot_w, rot_h = wm_img.size
            
            # Extract binary mask and apply opacity
            mask = wm_img.split()[3]
            alpha = ImageEnhance.Brightness(mask).enhance(opacity)
            wm_img.putalpha(alpha)
            
            margin = int(20 * (height / 400.0))
            if position == "top_left":
                x, y = margin, margin
            elif position == "top_right":
                x, y = width - rot_w - margin, margin
            elif position == "bottom_left":
                x, y = margin, height - rot_h - margin
            elif position == "bottom_right":
                x, y = width - rot_w - margin, height - rot_h - margin
            else: # center
                x, y = (width - rot_w) // 2, (height - rot_h) // 2
            
            overlay.paste(wm_img, (x, y), mask=mask)

        watermarked = Image.alpha_composite(base_img, overlay)
        
        ext = os.path.splitext(output)[1].lower()
        os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
        if ext in (".jpg", ".jpeg"):
            watermarked.convert("RGB").save(output, "JPEG", quality=95)
        else:
            watermarked.save(output, "PNG")
            
        print("Success")
    except Exception as e:
        print(f"Error applying watermark: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
