// js/home/request/run.js

document.getElementById('run-script-request-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-request').value;
    const token = document.getElementById('token-input').value;  // Récupérer le jeton

    if (!token) {
        alert("Veuillez entrer un jeton valide !");
        return;
    }

    fetch('/run-script-request', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'script_name': scriptName,
            'token': token  // Envoyer le jeton saisi
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('script-output').innerHTML = `<strong>Infos :</strong> ${data.message}`;
                if (data.data && data.data.code_obtenu) {
                    document.getElementById('script-output').innerHTML += `<br><strong>Code obtenu :</strong> ${data.data.code_obtenu}`;
                }
                else{
                    document.getElementById('script-output').innerHTML = `<strong>Infos :</strong> Erreur dans le JETON`;
                }
            } else if (data.status === 'error') {
                document.getElementById('script-output').innerHTML = `<strong>Erreur :</strong> ${data.message}`;
            } else {
                document.getElementById('script-output').innerHTML = 'Réponse inconnue du serveur.';
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);
            document.getElementById('script-output').innerHTML = 'Une erreur est survenue lors de l\'exécution du script.';
        });
});
