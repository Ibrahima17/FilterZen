// Liste de mots-clés sensibles avec leurs synonymes
const sensitiveKeywordsWithSynonyms = {
    "haine": ["animosité", "hostilité", "rancœur", "mépris"],
    "violence": ["brutalité", "agression", "fureur", "force"],
    "insulte": ["injure", "offense", "outrage"],
    "fils de pute": ["salaud", "connard", "enfoiré"],
    "toxique": ["nocif", "dangereux", "malfaisant"],
    "sexe": ["sexualité", "relations sexuelles", "copulation"],
    "porn": ["pornographie", "X", "film adulte"],
    "nudité": ["nu", "déshabillé", "dénudé"],
    "viol": ["agression sexuelle", "abus", "assaut"],
    "guerre": ["conflit", "bataille", "combat"],
    "meurtre": ["assassinat", "homicide", "liquidation"],
    "massacre": ["carnage", "boucherie", "tuerie"],
    "génocide": ["extermination", "anéantissement"],
    "combat": ["lutte", "affrontement", "bataille"],
    "exécution": ["mise à mort", "supplice", "châtiment"]
};

// Fonction pour vérifier si un mot est sensible
function isSensitiveWord(word) {
    word = word.toLowerCase();

    for (const keyword in sensitiveKeywordsWithSynonyms) {
        if (word === keyword) return true;
        for (const synonym of sensitiveKeywordsWithSynonyms[keyword]) {
            if (word === synonym) return true;
        }
    }

    return false;
}

// Fonction de filtrage du contenu texte
function filterContent() {
    console.log("FilterZen: Lancement du filtrage du contenu...");
    document.querySelectorAll('article').forEach(node => {
        if (!node.classList.contains('filterzen-processed')) {
            const words = node.innerText.toLowerCase().split(/\s+/); // Diviser en mots
            let isContentSensitive = false;

            words.forEach(word => {
                if (isSensitiveWord(word)) {
                    isContentSensitive = true;
                }
            });

            if (isContentSensitive) {
                console.log("FilterZen: Masquage du contenu contenant un ou plusieurs mots sensibles");
                addWarning(node);
            }

            node.classList.add('filterzen-processed');
        }
    });
}

// Fonction de filtrage des médias (images, vidéos)
function filterMedia() {
    console.log("FilterZen: Lancement du filtrage des médias...");
    document.querySelectorAll('video, iframe, img').forEach(media => {
        if (!media.classList.contains('filterzen-processed')) {
            const mediaTitle = (media.getAttribute('title') || media.getAttribute('alt') || media.getAttribute('aria-label') || media.getAttribute('src') || "").toLowerCase();
            const words = mediaTitle.split(/\s+/); // Diviser en mots
            let isMediaSensitive = false;

            words.forEach(word => {
                if (isSensitiveWord(word)) {
                    isMediaSensitive = true;
                }
            });

            if (isMediaSensitive) {
                console.log("FilterZen: Masquage de la vidéo/image contenant un mot sensible");
                addWarning(media);
            }

            media.classList.add('filterzen-processed');
        }
    });
}

// Ajouter un avertissement visuel sur le contenu masqué
function addWarning(node) {
    node.style.display = 'none'; // Masquer l'élément
    const warningMessage = document.createElement('div');
    warningMessage.innerText = 'Contenu masqué par FilterZen (contenu sensible)';
    warningMessage.style.padding = '10px';
    warningMessage.style.margin = '10px 0';
    warningMessage.style.borderRadius = '5px';
    warningMessage.style.border = '1px solid #ccc';

    // Ajouter un bouton pour révéler le contenu masqué
    const revealButton = document.createElement('button');
    revealButton.innerText = 'Afficher le contenu';
    revealButton.style.marginLeft = '10px';
    revealButton.style.padding = '5px 10px';
    revealButton.style.backgroundColor = '#007bff';
    revealButton.style.color = '#ffffff';
    revealButton.style.border = 'none';
    revealButton.style.borderRadius = '3px';
    revealButton.style.cursor = 'pointer';

    revealButton.addEventListener('click', () => {
        node.style.display = ''; // Réafficher l'élément masqué
        warningMessage.remove(); // Supprimer l'avertissement
    });

    warningMessage.appendChild(revealButton);
    node.parentNode.insertBefore(warningMessage, node);
}

// Appeler les fonctions de filtrage au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    console.log("FilterZen: Page chargée, lancement du filtrage initial...");
    filterContent();
    filterMedia();

    // Observer les modifications du DOM pour les nouveaux contenus
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                console.log("FilterZen: Modification détectée, analyse du contenu...");
                filterContent();
                filterMedia();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});

// Appeler le filtrage lors du défilement de la page
window.addEventListener('scroll', () => {
    console.log("FilterZen: Défilement détecté, lancement du filtrage...");
    filterContent();
    filterMedia();
});