// Arrêter le serveur SMTP
document.getElementById('smtp-stop-btn').addEventListener('click', function () {
    fetch('/smtp/stop', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('smtp-output').innerHTML = data;
            document.getElementById('console-output').textContent += data + "\n";
            document.getElementById('smtp-start-btn').disabled = false;  // Réactiver le bouton après arrêt
            document.getElementById('smtp-stop-btn').disabled = true;  // Réactiver le bouton après arrêt
            document.getElementById('smtp-modal-send-btn').disabled = true;  // Réactiver le bouton après arrêt
        })
        .catch((error) => {
            console.error('Erreur:', error);
            document.getElementById('smtp-output').innerHTML = 'Erreur lors de l\'arrêt du serveur SMTP.';
        });
});