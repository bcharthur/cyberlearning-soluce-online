// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('edit-script-base64-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-base64').value;

    fetch(`/get-script-base64?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            // Assure que l'ID "script-content-base64" est bien le bon dans ta modale
            document.getElementById('script-content-base64').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});
