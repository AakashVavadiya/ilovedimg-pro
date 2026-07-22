import sys
import json
import os

def main():
    if len(sys.argv) < 2:
        print("Usage: python blur_face.py <settings_json_path>")
        sys.exit(1)

    settings_path = sys.argv[1]
    if not os.path.exists(settings_path):
        print(f"Settings file not found: {settings_path}")
        sys.exit(1)

    with open(settings_path, "r", encoding="utf-8") as f:
        settings = json.load(f)

    input_path = settings.get("input", "")
    output = settings.get("output", "")
    blur_strength = settings.get("blur_strength", 50)

    if not input_path or not output:
        print("Error: 'input' and 'output' must be provided in settings.")
        sys.exit(1)

    try:
        from image_validator import validate_image_file
        validate_image_file(input_path, max_size_mb=25)
        
        import cv2
        import numpy as np

        print(f"Loading image for face blurring: {input_path}")
        # Load with UNCHANGED flag to preserve alpha channel if PNG
        img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
        if img is None:
            raise ValueError("Failed to load input image. The file format may be unsupported or corrupt.")

        # Convert to gray for Haar Cascades
        if len(img.shape) == 3 and img.shape[2] == 4:
            # PNG with transparency (BGRA)
            bgr = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
            gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
        elif len(img.shape) == 3 and img.shape[2] == 3:
            # Standard BGR
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        else:
            # Grayscale already
            gray = img

        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        face_cascade = cv2.CascadeClassifier(cascade_path)
        if face_cascade.empty():
            raise ValueError(f"Could not load Haar cascade classifier from {cascade_path}")

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )

        print(f"Detected {len(faces)} faces.")

        for (x, y, w, h) in faces:
            face_region = img[y:y+h, x:x+w]
            
            # Determine kernel size based on face bounding box and slider blur strength
            # Slider ranges 10 to 100
            scale = blur_strength / 100.0
            ksize = int(min(w, h) * scale * 0.7)
            if ksize % 2 == 0:
                ksize += 1
            if ksize < 3:
                ksize = 3

            # Apply Gaussian Blur to the region (cv2.GaussianBlur handles 4 channels fine)
            blurred_face = cv2.GaussianBlur(face_region, (ksize, ksize), 0)
            img[y:y+h, x:x+w] = blurred_face

        # Ensure output directory exists
        os.makedirs(os.path.dirname(os.path.abspath(output)), exist_ok=True)
        cv2.imwrite(output, img)
        print("Success")
    except Exception as e:
        print(f"Error executing face blurring: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
