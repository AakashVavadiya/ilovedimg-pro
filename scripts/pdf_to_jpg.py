import sys
import json
import os


def main():
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_jpg.py <settings_json_path>")
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

    import zipfile
    try:
        import fitz
    except ImportError:
        print("Error: Required package 'pymupdf' (fitz) is missing. Please install dependencies in requirements.txt.")
        sys.exit(1)

    try:
        print(f"Rendering PDF: {input_path} to JPG: {output}")
        doc = fitz.open(input_path)
        total_pages = len(doc)

        scratch_dir = os.path.dirname(os.path.abspath(output))

        if total_pages == 1:
            # Single page PDF: save directly as JPG
            page = doc.load_page(0)
            pix = page.get_pixmap(dpi=150)
            pix.save(output)
            print("Success")
        else:
            # Multi-page PDF: save individual JPGs and zip them
            temp_dir = output + "_temp_jpgs"
            os.makedirs(temp_dir, exist_ok=True)
            
            written_jpgs = []
            for page_num in range(total_pages):
                page = doc.load_page(page_num)
                pix = page.get_pixmap(dpi=150)
                out_name = f"page_{page_num+1}.jpg"
                out_path = os.path.join(temp_dir, out_name)
                pix.save(out_path)
                written_jpgs.append(out_path)

            # Zip them
            with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for file in written_jpgs:
                    zip_file.write(file, os.path.basename(file))
            
            # Cleanup temp jpgs
            for file in written_jpgs:
                try:
                    os.remove(file)
                except:
                    pass
            try:
                os.rmdir(temp_dir)
            except:
                pass
            print("Success")
            
        doc.close()
    except Exception as e:
        print(f"Error converting PDF to JPG: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
