// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('edit-script-tcpChaineEncodee-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-tcpChaineEncodee').value;

    fetch(`/get-script-tcpChaineEncodee?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            // Assure que l'ID "script-content-tcpRetourAuCollege" est bien le bon dans ta modale
            document.getElementById('script-content-tcpChaineEncodee').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});
