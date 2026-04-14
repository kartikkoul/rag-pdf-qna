import pymupdf
import re

def _clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text

def extract_text_from_pdf(file_bytes: bytes):
    doc = pymupdf.open(stream=file_bytes, filetype="pdf")

    pages = []

    for page_num, page in enumerate(doc):
        text = page.get_text()
        text = _clean_text(text)
        
        pages.append({
            "text": text,
            "page": page_num + 1
        })

    return pages