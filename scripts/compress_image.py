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

def compress_to_target_size(img, output_path, target_kb, ext):
    from PIL import Image
    target_bytes = target_kb * 1024
    
    save_format = "JPEG"
    if ext == ".webp":
        save_format = "WEBP"
    elif ext == ".png":
        save_format = "PNG"
    elif ext in (".jpg", ".jpeg"):
        save_format = "JPEG"

    quality = 95
    while quality >= 5:
        if save_format == "JPEG":
            if img.mode in ("RGBA", "LA", "P"):
                img_rgba = img.convert("RGBA")
                background = Image.new("RGB", img_rgba.size, (255, 255, 255))
                background.paste(img_rgba, mask=img_rgba.split()[3])
                temp_img = background
            else:
                temp_img = img
            temp_img.save(output_path, "JPEG", quality=quality, optimize=True)
        elif save_format == "WEBP":
            img.save(output_path, "WEBP", quality=quality, method=6)
        elif save_format == "PNG":
            img.save(output_path, "PNG", optimize=True, compress_level=9)
            
        current_size = os.path.getsize(output_path)
        if current_size <= target_bytes:
            return
            
        if save_format == "PNG":
            save_format = "JPEG"
            quality = 90
            continue
            
        quality -= 5
        
    if os.path.getsize(output_path) > target_bytes:
        scale = 0.9
        while scale >= 0.15:
            w, h = img.size
            resized = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
            
            if save_format == "JPEG":
                if resized.mode in ("RGBA", "LA", "P"):
                    resized_rgba = resized.convert("RGBA")
                    background = Image.new("RGB", resized_rgba.size, (255, 255, 255))
                    background.paste(resized_rgba, mask=resized_rgba.split()[3])
                    temp_resized = background
                else:
                    temp_resized = resized
                temp_resized.save(output_path, "JPEG", quality=30, optimize=True)
            elif save_format == "WEBP":
                resized.save(output_path, "WEBP", quality=30, method=6)
                
            if os.path.getsize(output_path) <= target_bytes:
                break
            scale -= 0.1

def main():
    if len(sys.argv) < 2:
        print("Usage: python compress_image.py <settings_json_path>")
        sys.exit(1)

    settings_path = sys.argv[1]
    if not os.path.exists(settings_path):
        print(f"Settings file not found: {settings_path}")
        sys.exit(1)

    with open(settings_path, "r", encoding="utf-8") as f:
        settings = json.load(f)

    input_path = settings.get("input", "")
    inputs = settings.get("inputs", [])
    output = settings.get("output", "")
    quality = int(settings.get("quality", 80))
    target_size_kb = settings.get("target_size_kb", None)
    if target_size_kb:
        target_size_kb = int(target_size_kb)

    if not output:
        print("Error: 'output' must be provided in settings.")
        sys.exit(1)

    if not input_path and not inputs:
        print("Error: 'input' or 'inputs' must be provided in settings.")
        sys.exit(1)

    install_and_import("PIL", "pillow")
    from PIL import Image
    from image_validator import validate_image_file
    import zipfile

    # Run image validation
    if inputs:
        for in_file in inputs:
            validate_image_file(in_file, max_size_mb=25)
    else:
        validate_image_file(input_path, max_size_mb=25)

    def compress_single(src_path, dest_path):
        img = Image.open(src_path)
        ext = os.path.splitext(dest_path)[1].lower()
        if not ext:
            ext = ".png"
            
        if target_size_kb:
            compress_to_target_size(img, dest_path, target_size_kb, ext)
        else:
            if ext in (".jpg", ".jpeg"):
                if img.mode in ("RGBA", "LA", "P"):
                    img_rgba = img.convert("RGBA")
                    background = Image.new("RGB", img_rgba.size, (255, 255, 255))
                    background.paste(img_rgba, mask=img_rgba.split()[3])
                    img = background
                img.save(dest_path, "JPEG", quality=quality, optimize=True)
            elif ext == ".png":
                comp_level = int((100 - quality) / 10)
                comp_level = max(0, min(9, comp_level))
                img.save(dest_path, "PNG", optimize=True, compress_level=comp_level)
            elif ext == ".webp":
                img.save(dest_path, "WEBP", quality=quality, method=6)
            else:
                img.save(dest_path, optimize=True)

    try:
        if inputs:
            temp_outputs = []
            for idx, in_file in enumerate(inputs):
                filename = os.path.basename(in_file)
                base, ext = os.path.splitext(filename)
                if not ext:
                    ext = ".png"
                out_name = f"{base}_compressed{ext}"
                out_path = os.path.join(os.path.dirname(output), f"temp_comp_{idx}_{out_name}")
                
                print(f"Compressing bulk: {in_file} -> {out_path}")
                compress_single(in_file, out_path)
                temp_outputs.append((out_path, out_name))
                
            print(f"Creating zip file: {output}")
            with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for temp_path, name in temp_outputs:
                    zip_file.write(temp_path, name)
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
        else:
            compress_single(input_path, output)
            
        print("Success")
    except Exception as e:
        print(f"Error compressing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
