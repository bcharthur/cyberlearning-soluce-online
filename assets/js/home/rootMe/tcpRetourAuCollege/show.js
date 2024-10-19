// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('show-script-tcpRetourAuCollege-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-tcpRetourAuCollege').value;

    fetch(`/get-script-show-tcpRetourAuCollege?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('script-content-show-tcpRetourAuCollege').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});