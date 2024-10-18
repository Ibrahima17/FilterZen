document.addEventListener('DOMContentLoaded', function() {
    // Récupère les éléments du DOM
    const addButton = document.getElementById('add-button');
    const keywordInput = document.getElementById('keyword-input');
    const filterToggle = document.getElementById('filter-toggle');

    // Écouter l'événement de clic sur le bouton "Ajouter"
    addButton.addEventListener('click', function() {
        const keyword = keywordInput.value.trim();

        if (keyword) {
            // Enregistrer le mot-clé dans le stockage local (local storage)
            chrome.storage.local.get(['sensitiveKeywords'], function(result) {
                let keywords = result.sensitiveKeywords || [];
                if (!keywords.includes(keyword)) {
                    keywords.push(keyword);
                    chrome.storage.local.set({ sensitiveKeywords: keywords }, function() {
                        console.log(`Mot-clé ajouté: ${keyword}`);
                        alert(`Mot-clé ajouté : ${keyword}`);
                        keywordInput.value = ""; // Effacer l'input après ajout
                    });
                } else {
                    alert("Ce mot-clé est déjà dans la liste.");
                }
            });
        }
    });

    // Charger et afficher l'état du filtrage au chargement
    chrome.storage.local.get(['filterEnabled'], function(result) {
        filterToggle.checked = result.filterEnabled || false;
    });

    // Sauvegarder l'état du filtre
    filterToggle.addEventListener('change', function() {
        chrome.storage.local.set({ filterEnabled: filterToggle.checked }, function() {
            console.log(`Filtrage ${filterToggle.checked ? 'activé' : 'désactivé'}`);
        });
    });
});