// Charger le contenu du script dans la modal lors de l'ouverture
document.getElementById('show-script-tcpLaRoueRomaine-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-tcpLaRoueRomaine').value;

    fetch(`/get-script-show-tcpLaRoueRomaine?script_name=${scriptName}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('script-content-show-tcpLaRoueRomaine').value = data;
        })
        .catch((error) => {
            console.error('Erreur lors du chargement du script:', error);
        });
});