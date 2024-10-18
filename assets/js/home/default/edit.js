// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('edit-script-default-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-default').value;

    fetch(`/get-script-default?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('script-content-default').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});