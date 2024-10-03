document.addEventListener('DOMContentLoaded', function () {
    // Vérifier l'état du serveur SMTP au chargement
    fetch('/smtp/status')
        .then(response => response.text())
        .then(status => {
            if (status === "running") {
                document.getElementById('smtp-start-btn').disabled = true;
                // document.getElementById('send-mail-btn').disabled = false; // Activer le bouton "Envoyer un mail"
                document.getElementById('smtp-output').innerHTML = "Serveur SMTP déjà démarré.";
            } else {
                document.getElementById('smtp-start-btn').disabled = false;
                // document.getElementById('send-mail-btn').disabled = true; // Désactiver le bouton "Envoyer un mail"
                document.getElementById('smtp-output').innerHTML = "Serveur SMTP arrêté.";
            }
        })
        .catch(error => console.error('Erreur lors de la vérification du statut du serveur SMTP:', error));
});
