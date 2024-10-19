// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('show-script-deuxFoisDeSuite-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-deuxFoisDeSuite').value;

    fetch(`/get-script-show-deuxFoisDeSuite?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('script-content-show-deuxFoisDeSuite').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});