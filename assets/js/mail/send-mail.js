// Envoi d'un mail
document.getElementById('send-mail-btn').addEventListener('click', function () {
    const fromEmail = document.getElementById('from-email').value;
    const toEmail = document.getElementById('to-email').value;
    const subject = document.getElementById('subject').value;
    const body = document.getElementById('body').value;

    const sendMailBtn = document.getElementById('send-mail-btn');
    const sendMailSpinner = document.getElementById('send-mail-spinner');

    // Désactiver le bouton et afficher le spinner
    sendMailBtn.disabled = true;
    sendMailSpinner.classList.remove('d-none');

    fetch('/send-mail', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'from': fromEmail,
            'to': toEmail,
            'subject': subject,
            'body': body
        })
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('smtp-output').innerHTML = data;  // Afficher le résultat
            document.getElementById('console-output').textContent += data + "\n";

            // Réinitialiser l'état du bouton et cacher le spinner
            sendMailBtn.disabled = false;
            sendMailSpinner.classList.add('d-none');

            // Fermer la modal après l'envoi du mail
            var sendMailModal = bootstrap.Modal.getInstance(document.getElementById('sendMailModal'));
            sendMailModal.hide();
        })
        .catch((error) => {
            console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
            document.getElementById('smtp-output').innerHTML = 'Erreur lors de l\'envoi de l\'e-mail.';

            // Réinitialiser l'état du bouton et cacher le spinner en cas d'erreur
            sendMailBtn.disabled = false;
            sendMailSpinner.classList.add('d-none');
        });
});

document.getElementById('sendMailModal').addEventListener('show.bs.modal', function () {
    // Remplir automatiquement les champs lors de l'ouverture de la modal
    document.getElementById('from-email').value = 'eni.sortir.notif@gmail.com'; // Valeur par défaut
    document.getElementById('to-email').value = ''; // Laisser vide pour la saisie utilisateur
    document.getElementById('subject').value = ''; // Laisser vide pour la saisie utilisateur
    document.getElementById('body').value = ''; // Laisser vide pour la saisie utilisateur
});
