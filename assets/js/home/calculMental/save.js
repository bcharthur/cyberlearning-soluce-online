// Sauvegarder les modifications du script
document.getElementById('save-script-calculMental-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-calculMental').value;
    const scriptContent = document.getElementById('script-content-calculMental').value; // Assure que l'ID est correct

    fetch('/save-script-calculMental', {
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
            var editModal = bootstrap.Modal.getInstance(document.getElementById('editScriptCalculMentalModal'));
            editModal.hide();

            var successModal = new bootstrap.Modal(document.getElementById('successCalculMentalModal'));
            successModal.show();
        })
        .catch((error) => {
            console.error('Erreur lors de la sauvegarde du script:', error);
        });
});
