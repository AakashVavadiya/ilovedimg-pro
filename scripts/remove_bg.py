import sys
import json
import os


def main():
    if len(sys.argv) < 2:
        print("Usage: python remove_bg.py <settings_json_path> OR python remove_bg.py <input_path> <output_path>")
        sys.exit(1)

    first_arg = sys.argv[1]
    if len(sys.argv) == 2 or first_arg.endswith(".json"):
        if not os.path.exists(first_arg):
            print(f"Settings file not found: {first_arg}")
            sys.exit(1)
        with open(first_arg, "r", encoding="utf-8") as f:
            settings = json.load(f)
        input_path = settings.get("input", "")
        output_path = settings.get("output", "")
    else:
        if len(sys.argv) < 3:
            print("Usage: python remove_bg.py <input_path> <output_path>")
            sys.exit(1)
        input_path = sys.argv[1]
        output_path = sys.argv[2]
        settings = {}

    if not input_path or not output_path:
        print("Error: Input and output paths must be specified.")
        sys.exit(1)

    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}")
        sys.exit(1)

    try:
        from rembg import remove, new_session
        from PIL import Image, ImageFilter, ImageOps
    except ImportError as e:
        print(f"Error: Required packages ('rembg' or 'Pillow') are missing ({e}). Please install dependencies in requirements.txt.")
        sys.exit(1)

    try:
        from image_validator import validate_image_file
        validate_image_file(input_path, max_size_mb=15)
        print(f"Processing clean background removal: {input_path}")
        input_image = Image.open(input_path).convert("RGBA")
        
        model_name = settings.get("model", "u2net_human_seg")
        # Ensure only known safe models are processed
        if model_name not in ["u2net", "u2net_human_seg", "isnet-general-use", "silueta"]:
            model_name = "u2net_human_seg"

        # Attempt fast rembg execution on CPU to avoid CUDA/GPU version mismatch bugs
        try:
            session = new_session(model_name, providers=['CPUExecutionProvider'])
        except Exception as e1:
            print(f"Failed loading primary model {model_name} on CPU: {e1}")
            try:
                # Fallback to standard u2net if the requested model failed
                fallback_model = "u2net" if model_name != "u2net" else "isnet-general-use"
                session = new_session(fallback_model, providers=['CPUExecutionProvider'])
            except Exception:
                session = None

        try:
            if session:
                output_image = remove(input_image, session=session)
            else:
                output_image = remove(input_image)
        except Exception as rembg_err:
            print(f"Rembg execution failed, trying default remove: {rembg_err}")
            output_image = remove(input_image)
        
        # Post-process alpha channel to smooth edges and clean background artifacts
        if output_image.mode == "RGBA":
            r, g, b, a = output_image.split()
            # Clean tiny noise values in alpha channel
            a = a.point(lambda p: 0 if p < 15 else (255 if p > 245 else p))
            # Apply adjustable gaussian blur to the alpha channel to make edges soft & smooth
            smooth_radius = float(settings.get("smooth_edge", 1.0))
            if smooth_radius > 0:
                a_smoothed = a.filter(ImageFilter.GaussianBlur(smooth_radius))
                output_image = Image.merge("RGBA", (r, g, b, a_smoothed))
        
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        output_image.save(output_path, "PNG")
        
        # Save copies for debugging
        try:
            import shutil
            scratch_dir = os.path.dirname(input_path)
            shutil.copy2(input_path, os.path.join(scratch_dir, "last_input.jpg"))
            shutil.copy2(output_path, os.path.join(scratch_dir, "last_output.png"))
            print("Saved debug copies to scratch/")
        except Exception as debug_err:
            print(f"Failed to save debug copies: {debug_err}")
            
        print("Success")
    except Exception as e:
        print(f"Error executing background removal: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
