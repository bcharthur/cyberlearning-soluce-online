// Redémarrer le serveur SMTP
document.getElementById('smtp-restart-btn').addEventListener('click', function () {
    fetch('/smtp/restart', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        }
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('smtp-output').innerHTML = data;
            document.getElementById('console-output').textContent += data + "\n";

            // // Envoyer automatiquement un e-mail après le redémarrage du serveur SMTP
            // sendAutomaticEmail();
        })
        .catch((error) => {
            console.error('Erreur lors du redémarrage du serveur SMTP:', error);
            document.getElementById('smtp-output').innerHTML = 'Erreur lors du redémarrage du serveur SMTP.';
        });
});

// // Fonction pour envoyer un e-mail automatique
// function sendAutomaticEmail() {
//     const fromEmail = 'eni.sortir.notif@gmail.com';  // Valeur par défaut
//     const toEmail = 'art.bouchaud@gmail.com';  // Modifie cette valeur
//     const subject = 'Serveur SMTP Redémarré';  // Modifie cette valeur
//     const body = 'Le serveur SMTP a été redémarré avec succès. Voici le message envoyé automatiquement.';  // Modifie cette valeur
//
//     fetch('/send-mail', {
//         method: 'POST',
//         headers: {
//             'X-Requested-With': 'XMLHttpRequest',
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//             'from': fromEmail,
//             'to': toEmail,
//             'subject': subject,
//             'body': body
//         })
//     })
//         .then(response => response.text())
//         .then(data => {
//             document.getElementById('smtp-output').innerHTML += `<br>${data}`;
//             document.getElementById('console-output').textContent += data + "\n";
//         })
//         .catch((error) => {
//             console.error('Erreur lors de l\'envoi de l\'e-mail automatique:', error);
//             document.getElementById('smtp-output').innerHTML = 'Erreur lors de l\'envoi de l\'e-mail automatique.';
//         });
// }
