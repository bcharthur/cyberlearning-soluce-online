document.getElementById('btn-download-calculMental').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-calculMental').value;
    const downloadBtn = this;

    if (!scriptName) {
        alert("Veuillez sélectionner un script à télécharger.");
        return;
    }

    // Désactiver le bouton et ajouter un spinner
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    fetch(`/get-script-calculMental?script_name=${encodeURIComponent(scriptName)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération du script.');
            }
            return response.text();
        })
        .then(scriptContent => {
            // Créer un élément de lien pour télécharger le fichier
            const blob = new Blob([scriptContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = scriptName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  // Libérer l'URL Blob

            // Réactiver le bouton et retirer le spinner
            downloadBtn.innerHTML = `<i class="fa-solid fa-download"></i>`;
            downloadBtn.disabled = false;
        })
        .catch(error => {
            console.error('Erreur:', error);
            downloadBtn.innerHTML = `<i class="fa-solid fa-download"></i>`;
            downloadBtn.disabled = false;
            alert('Une erreur est survenue lors du téléchargement du script.');
        });
});
