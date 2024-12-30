document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de partage chargé');
    
    // Sélectionner toutes les citations (blockquotes)
    const quotes = document.querySelectorAll('blockquote');
    console.log('Nombre de citations trouvées:', quotes.length);
    
    quotes.forEach((quote, index) => {
        console.log(`Traitement de la citation ${index + 1}`);
        
        // Créer le conteneur de boutons
        const shareButtons = document.createElement('div');
        shareButtons.className = 'share-buttons';
        shareButtons.style.opacity = '0';
        shareButtons.style.transition = 'opacity 0.3s';
        
        // Obtenir le texte de la citation
        const quoteText = quote.querySelector('p') ? quote.querySelector('p').textContent : quote.textContent;
        console.log('Texte de la citation:', quoteText.substring(0, 50) + '...');
        
        // Obtenir le lien source
        const sourceLink = quote.nextElementSibling?.querySelector('a')?.href || 'https://aurores.org';
        const pdfLink = sourceLink.includes('#page=') ? sourceLink : 'https://aurores.org/wp-content/uploads/2024/12/PROGRAMME-.pdf';
        console.log('Lien source:', pdfLink);
        
        // Configuration des boutons de partage
        const buttons = [
            {
                platform: 'twitter',
                icon: 'bi-twitter-x',
                url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(quoteText)}&url=${encodeURIComponent(pdfLink)}`
            },
            {
                platform: 'bluesky',
                icon: 'bi-cloud',
                url: `https://bsky.app/intent/compose?text=${encodeURIComponent(quoteText)}`
            },
            {
                platform: 'linkedin',
                icon: 'bi-linkedin',
                url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pdfLink)}`
            },
            {
                platform: 'facebook',
                icon: 'bi-facebook',
                url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pdfLink)}`
            },
            {
                platform: 'mastodon',
                icon: 'bi-mastodon',
                url: `https://mastodon.social/share?text=${encodeURIComponent(quoteText)}`
            }
        ];
        
        // Créer les boutons
        buttons.forEach(button => {
            const link = document.createElement('a');
            link.href = button.url;
            link.className = `share-button ${button.platform}`;
            link.target = '_blank';
            link.rel = 'noopener';
            
            const icon = document.createElement('i');
            icon.className = `bi ${button.icon}`;
            
            link.appendChild(icon);
            shareButtons.appendChild(link);
        });
        
        // Insérer les boutons après la citation
        quote.insertAdjacentElement('afterend', shareButtons);
        console.log(`Boutons de partage ajoutés pour la citation ${index + 1}`);
        
        // Gérer l'affichage au survol
        const container = quote.parentNode;
        container.addEventListener('mouseenter', () => {
            shareButtons.style.opacity = '1';
            console.log(`Survol de la citation ${index + 1}`);
        });
        
        container.addEventListener('mouseleave', () => {
            shareButtons.style.opacity = '0';
            console.log(`Fin du survol de la citation ${index + 1}`);
        });
    });
});
