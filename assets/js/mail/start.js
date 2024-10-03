// Démarrer le serveur SMTP
document.getElementById('smtp-start-btn').addEventListener('click', function () {
    fetch('/smtp/start', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'port': 1025
        })
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('smtp-output').innerHTML = data;
            document.getElementById('console-output').textContent += data + "\n";
            document.getElementById('smtp-start-btn').disabled = true;  // Désactiver le bouton après démarrage
            document.getElementById('smtp-stop-btn').disabled = false;  // Réactiver le bouton après arrêt
            document.getElementById('smtp-modal-send-btn').disabled = false;  // Réactiver le bouton après arrêt
        })
        .catch((error) => {
            console.error('Erreur:', error);
            document.getElementById('smtp-output').innerHTML = 'Erreur lors du démarrage du serveur SMTP.';
        });
});