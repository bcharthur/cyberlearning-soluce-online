// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('edit-script-tcpRetourAuCollege-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-tcpRetourAuCollege').value;

    fetch(`/get-script-tcpRetourAuCollege?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            // Assure que l'ID "script-content-tcpRetourAuCollege" est bien le bon dans ta modale
            document.getElementById('script-content-tcpRetourAuCollege').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});
