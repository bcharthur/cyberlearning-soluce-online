// js/home/request/run.js

document.getElementById('run-script-request-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-request').value;

    fetch('/run-script-request', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'script_name': scriptName
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                let outputHtml = `<strong>Succès :</strong> ${data.message}`;
                if (data.data && data.data.code_obtenu) {
                    outputHtml += `<br><strong>Code obtenu :</strong> ${data.data.code_obtenu}`;
                }
                document.getElementById('script-output').innerHTML = outputHtml;
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
