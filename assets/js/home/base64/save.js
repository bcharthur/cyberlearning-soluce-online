// Sauvegarder les modifications du script
document.getElementById('save-script-base64-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-base64').value;
    const scriptContent = document.getElementById('script-content-base64').value; // Assure que l'ID est correct

    fetch('/save-script-base64', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'script_name': scriptName,
            'script_content': scriptContent
        })
    })
        .then(response => response.text())
        .then(data => {
            // Fermer la modal d'édition et afficher la modal de succès
            var editModal = bootstrap.Modal.getInstance(document.getElementById('editScriptBase64Modal'));
            editModal.hide();

            var successModal = new bootstrap.Modal(document.getElementById('successBase64Modal'));
            successModal.show();
        })
        .catch((error) => {
            console.error('Erreur lors de la sauvegarde du script:', error);
        });
});
