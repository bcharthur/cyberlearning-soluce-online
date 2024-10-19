// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('show-script-request-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-request').value;

    fetch(`/get-script-show-request?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('script-content-show-request').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});