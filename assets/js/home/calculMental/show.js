// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('show-script-calculMental-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-calculMental').value;

    fetch(`/get-script-show-calculMental?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('script-content-show-calculMental').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});