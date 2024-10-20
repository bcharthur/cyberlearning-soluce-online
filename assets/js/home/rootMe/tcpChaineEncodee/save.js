// Sauvegarder les modifications du script
document.getElementById('save-script-tcpChaineEncodee-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-tcpChaineEncodee').value;
    const scriptContent = document.getElementById('script-content-tcpChaineEncodee').value; // Assure que l'ID est correct

    fetch('/save-script-tcpChaineEncodee', {
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
            var editModal = bootstrap.Modal.getInstance(document.getElementById('editScriptTcpChaineEncodeeModal'));
            editModal.hide();

            var successModal = new bootstrap.Modal(document.getElementById('successTcpChaineEncodeeModal'));
            successModal.show();
        })
        .catch((error) => {
            console.error('Erreur lors de la sauvegarde du script:', error);
        });
});
