import sys
import os

def validate_image_file(src_path, max_size_mb=25):
    # 1. Check file size
    if not os.path.exists(src_path):
        print(f"Error: Image file not found: {src_path}")
        sys.exit(1)
        
    size_bytes = os.path.getsize(src_path)
    size_mb = size_bytes / (1024 * 1024)
    if size_mb > max_size_mb:
        print(f"Error: File size ({size_mb:.2f} MB) exceeds allowed limit of {max_size_mb} MB.")
        sys.exit(1)
        
    try:
        from PIL import Image
    except ImportError:
        # Pillow will be installed by script runner
        return
        
    try:
        # 2. Verify basic structure and headers
        img = Image.open(src_path)
        img.verify()
        
        # 3. Re-open to read parameters (verify() closes file pointer)
        img = Image.open(src_path)
        w, h = img.size
        pixels = w * h
        
        # 4. Dimension checks (Max 10k x 10k or 50 Megapixels)
        if w > 10000 or h > 10000:
            print(f"Error: Image dimensions ({w}x{h}) exceed maximum allowed limit of 10,000 x 10,000 pixels.")
            sys.exit(1)
            
        if pixels > 100000000:
            print(f"Error: Image resolution ({pixels / 1e6:.2f} MP) exceeds maximum allowed limit of 100 Megapixels.")
            sys.exit(1)
            
        if w <= 0 or h <= 0:
            print("Error: Empty or zero-size image uploaded.")
            sys.exit(1)
            
        # 5. Aspect ratio check (decompression bomb / extreme shape protection)
        ratio = w / h
        if ratio > 100 or ratio < 0.01:
            print(f"Error: Abnormal aspect ratio ({w}:{h}) rejected for server safety.")
            sys.exit(1)
            
        # 6. Reject animated GIFs (Static GIF only)
        if getattr(img, "is_animated", False):
            print("Error: Animated GIF files are not allowed. Static GIF files only.")
            sys.exit(1)
            
        # 7. Check for corrupted/truncated pixels by loading pixel data
        try:
            img.load()
        except Exception as load_err:
            print(f"Error: Corrupted or truncated image data: {load_err}")
            sys.exit(1)

        # Print resolution for dynamic route logging
        print(f"RESOLUTION: {w}x{h}")
        
    except Exception as e:
        print(f"Error: Invalid or corrupted image header: {e}")
        sys.exit(1)
