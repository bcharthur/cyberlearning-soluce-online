// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('show-script-base64-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-base64').value;

    fetch(`/get-script-show-base64?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('script-content-show-base64').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});