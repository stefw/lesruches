import pdfplumber

def extract_specific_pages(pdf_path, pages_to_extract):
    """
    Extrait le texte des pages spécifiques d'un PDF.
    """
    content = {}
    
    with pdfplumber.open(pdf_path) as pdf:
        for page_num in pages_to_extract:
            if page_num <= len(pdf.pages):
                page = pdf.pages[page_num - 1]  # pdfplumber utilise un index 0-based
                text = page.extract_text()
                if text:
                    content[page_num] = text.strip()
                    print(f"\n=== Page {page_num} ===\n")
                    print(text.strip())
                    print("\n")

    return content

if __name__ == "__main__":
    pdf_path = "PROGRAMME-.pdf"
    pages_to_extract = [23, 42]  # Les pages que nous voulons extraire
    try:
        content = extract_specific_pages(pdf_path, pages_to_extract)
    except Exception as e:
        print(f"Erreur lors de l'extraction : {e}")
