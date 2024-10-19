// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('edit-script-deuxFoisDeSuite-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-deuxFoisDeSuite').value;

    fetch(`/get-script-deuxFoisDeSuite?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            // Assure que l'ID "script-content-calculMental" est bien le bon dans ta modale
            document.getElementById('script-content-deuxFoisDeSuite').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});
