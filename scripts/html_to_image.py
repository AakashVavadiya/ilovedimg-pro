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
        print("Usage: python html_to_image.py <settings_json_path>")
        sys.exit(1)

    settings_path = sys.argv[1]
    if not os.path.exists(settings_path):
        print(f"Settings file not found: {settings_path}")
        sys.exit(1)

    with open(settings_path, "r", encoding="utf-8") as f:
        settings = json.load(f)

    input_file = settings.get("input", "")
    url = settings.get("url", "")
    html_content = settings.get("html", "")
    output = settings.get("output", "")
    width = int(settings.get("width", 1280))
    height = int(settings.get("height", 720))

    if input_file and os.path.exists(input_file):
        with open(input_file, "r", encoding="utf-8", errors="ignore") as hf:
            html_content = hf.read()

    if not output or (not url and not html_content and not input_file):
        print("Error: 'output' and an HTML file, 'url', or 'html' content must be provided in settings.")
        sys.exit(1)

    try:
        from html2image import Html2Image  # type: ignore
    except ImportError:
        install_and_import("html2image")
        from html2image import Html2Image  # type: ignore

    try:
        print(f"Converting HTML to image at {output} ({width}x{height})")
        
        # Initialize html2image
        hti = Html2Image(size=(width, height))
        
        output_dir = os.path.dirname(os.path.abspath(output))
        output_file = os.path.basename(output)
        
        # Set output directory in hti
        hti.output_path = output_dir

        if input_file and os.path.exists(input_file):
            print("Screenshotting uploaded HTML file content")
            with open(input_file, "r", encoding="utf-8", errors="ignore") as hf:
                file_html = hf.read()
            hti.screenshot(html_str=file_html, save_as=output_file)
        elif html_content and html_content.strip():
            print("Screenshotting raw HTML content")
            hti.screenshot(html_str=html_content, save_as=output_file)
        elif url and url.strip():
            print(f"Screenshotting URL: {url}")
            hti.screenshot(url=url, save_as=output_file)
        else:
            print("Error: No valid HTML file, code content, or URL provided.")
            sys.exit(1)

        # Confirm file was created
        if os.path.exists(output):
            print("Success")
        else:
            print("Error: html2image failed to write output file.")
            sys.exit(1)
            
    except Exception as e:
        print(f"Error converting HTML to image: {e}")
        print("Tip: This tool runs offline but requires Google Chrome or Chromium to be installed on your machine.")
        sys.exit(1)

if __name__ == "__main__":
    main()
