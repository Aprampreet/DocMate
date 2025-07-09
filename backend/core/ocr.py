import pytesseract
from PIL import Image

def extract_text_from_image(image_path: str) ->str:
    try:
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        return text.strip()
    except Exception as e:
        print("OCR error:", e)
        return "Error reading image"
