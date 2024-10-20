// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('show-script-tcpChaineEncodee-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-tcpChaineEncodee').value;

    fetch(`/get-script-show-tcpChaineEncodee?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('script-content-show-tcpChaineEncodee').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});