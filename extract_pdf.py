from pdfminer.high_level import extract_text_to_fp, extract_pages
from pdfminer.layout import LAParams, LTTextContainer, LTChar, LTText
from io import StringIO
import re

def clean_text(text):
    # Supprimer les numéros de page isolés
    text = re.sub(r'\n\s*\d+\s*\n', '\n', text)
    
    # Corriger les coupures de mots avec tirets
    text = re.sub(r'(\w+)-\s*\n(\w+)', r'\1\2', text)
    
    # Supprimer les espaces multiples et les sauts de ligne excessifs
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n\n', text)
    
    # Préserver les listes à puces
    text = re.sub(r'•\s+', '\n• ', text)
    
    # Restaurer la structure des paragraphes
    text = re.sub(r'([.!?])\s+([A-Z])', r'\1\n\n\2', text)
    
    # Nettoyer les caractères spéciaux
    text = text.replace('ﬁ', 'fi')
    text = text.replace('ﬂ', 'fl')
    
    return text

def extract_text_with_layout(pdf_path, output_path):
    # Paramètres de mise en page optimisés
    laparams = LAParams(
        line_margin=0.2,      # Réduit pour mieux détecter les lignes
        word_margin=0.1,
        char_margin=1.0,
        boxes_flow=0.5,
        detect_vertical=True,
        all_texts=True
    )

    # Compter le nombre de pages
    page_count = len(list(extract_pages(pdf_path)))
    print(f"Nombre total de pages dans le PDF : {page_count}")

    # Buffer pour stocker le texte
    output_string = StringIO()
    
    # Extraction avec gestion de la mise en page
    with open(pdf_path, 'rb') as fin:
        extract_text_to_fp(fin, output_string, laparams=laparams)
    
    text = output_string.getvalue()
    
    # Nettoyer le texte
    text = clean_text(text)

    # Statistiques sur le texte extrait
    lines = text.split('\n')
    words = text.split()
    print(f"Nombre de lignes extraites : {len(lines)}")
    print(f"Nombre de mots extraits : {len(words)}")
    
    # Écrire le résultat dans un fichier
    with open(output_path, 'w', encoding='utf-8') as fout:
        fout.write(text)
        
    print(f"Texte extrait sauvegardé dans : {output_path}")

if __name__ == "__main__":
    pdf_path = "PROGRAMME-.pdf"
    output_path = "p.txt"
    extract_text_with_layout(pdf_path, output_path)
