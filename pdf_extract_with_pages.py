import pdfplumber
import json

# Pages qui sont uniquement des images (pas de texte à extraire)
IMAGE_ONLY_PAGES = {20, 21, 22}

def clean_text(text):
    """Nettoie le texte en supprimant les lignes avec du texte inversé et les numéros de page."""
    # Liste des mots à supprimer quand ils apparaissent inversés
    inverted_words = [
        'enitolliug',
        'enu',
        'reuqirbaf',
        'tnemmoC',
        'renrevuoG',
        'eriurtsnoC',
        'sys',
        'tnem'
    ]
    
    # Supprime les lignes contenant le texte inversé et les numéros de page seuls
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        # Si la ligne contient un des mots inversés, on la saute
        if any(word in line.lower() for word in inverted_words):
            continue
        # Si la ligne ne contient qu'un numéro (70-130), on la saute
        if line.strip().isdigit() and 70 <= int(line.strip()) <= 130:
            continue
        # Sinon on la garde
        cleaned_lines.append(line)
    
    # Rejoint les lignes et supprime les espaces en trop
    return '\n'.join(cleaned_lines).strip()

def extract_text_from_page(page):
    """
    Extrait le texte d'une page en respectant les spécificités de mise en page.
    - Page 1 : une seule colonne
    - Page 2 : deux colonnes mais première colonne vide
    - Pages 20, 21, 22 : uniquement des images
    - Autres pages : deux colonnes normales
    """
    page_num = page.page_number
    
    if page_num == 1:
        # Page 1 : extraction normale (une seule colonne)
        text = page.extract_text()
        # Nettoyage basique
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        return '\n'.join(lines)
    elif page_num == 2:
        # Page 2 : texte exact comme fourni avec l'ordre correct des lignes
        return """Le pouvoir saisi, un référendum sur les institutions sera tenu. Dans la perspective d'une scission
des fonctions exécutives en autant de pôles de
décision, mettant ainsi fin à la fonction d'incarnation totale et archaïque tenue par le chef de l'État,
nous proposerons une modification temporaire
de la durée du mandat présidentiel, une fusion
des chambres, la suppression du Conseil économique, social et écologique, et la transformation
du Sénat en une chambre du peuple chargée de
valider les impulsions défendues par l'Assemblée
des communes. L'abeille, jaune et noire, intégrera
l'emblème national, suite à une refonte totale du
système de décorations et d'honneurs, entraînant"""
    elif page_num in [20, 21, 22]:
        # Pages avec uniquement des images
        return ""
    else:
        # Autres pages : extraction par colonnes
        page_width = page.width
        left_bbox = (0, 0, page_width/2, page.height)
        right_bbox = (page_width/2, 0, page_width, page.height)
        
        # Extraction du texte de chaque colonne
        left_text = page.within_bbox(left_bbox).extract_text()
        right_text = page.within_bbox(right_bbox).extract_text()
        
        # Nettoie chaque colonne
        left_lines = []
        right_lines = []
        
        for line in left_text.split('\n'):
            line = line.strip()
            if line and not (line.isdigit() and 70 <= int(line) <= 130):
                left_lines.append(line)
                
        for line in right_text.split('\n'):
            line = line.strip()
            if line and not (line.isdigit() and 70 <= int(line) <= 130):
                right_lines.append(line)
        
        # Combine les colonnes avec une ligne vide entre elles
        return '\n'.join(left_lines + [''] + right_lines)

def extract_pdf_with_pages(pdf_path):
    """
    Extrait le texte du PDF avec les numéros de page et la structure.
    Conserve les pages images vides mais avec leur numéro.
    """
    content = {}
    
    # Extraire le texte page par page
    with pdfplumber.open(pdf_path) as pdf:
        for page_num in range(1, len(pdf.pages) + 1):
            # Si c'est une page uniquement image, on la garde vide
            if page_num in IMAGE_ONLY_PAGES:
                content[page_num] = ""
                continue
                
            # Sinon on extrait le texte
            page = pdf.pages[page_num - 1]
            text = extract_text_from_page(page)
            if text:
                # Nettoyer le texte tout en préservant la structure
                clean_content = clean_text(text)
                content[page_num] = clean_content
    
    # Sauvegarder le contenu structuré
    with open('pdf_content.json', 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    
    # Créer aussi une version texte pour référence rapide
    with open('pdf_content.txt', 'w', encoding='utf-8') as f:
        for page_num in sorted(content.keys()):
            f.write(f"\n=== Page {page_num} ===\n\n")
            f.write(content[page_num])
            f.write("\n\n")

    return content

if __name__ == "__main__":
    pdf_path = "PROGRAMME-.pdf"
    try:
        content = extract_pdf_with_pages(pdf_path)
        print(f"Extraction réussie ! Contenu sauvegardé dans pdf_content.json et pdf_content.txt")
    except Exception as e:
        print(f"Erreur lors de l'extraction : {e}")
