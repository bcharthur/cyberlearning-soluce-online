// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('edit-script-calculMental-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-calculMental').value;

    fetch(`/get-script-calculMental?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            // Assure que l'ID "script-content-calculMental" est bien le bon dans ta modale
            document.getElementById('script-content-calculMental').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});
