document.getElementById('run-script-request-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-request').value;
    const token = document.getElementById('token-input').value;  // Récupérer le jeton

    if (!token) {
        alert("Veuillez entrer un jeton valide !");
        return;
    }

    // Désactiver les boutons pendant le chargement
    const runBtn = document.getElementById('run-script-request-btn');
    const editBtn = document.getElementById('edit-script-request-btn');
    runBtn.disabled = true;
    editBtn.disabled = true;

    // Ajouter le spinner dans le bouton "Run"
    runBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

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
            // Remettre le bouton à son état initial
            runBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;

            // Réactiver les boutons après le succès ou l'erreur
            runBtn.disabled = false;
            editBtn.disabled = false;

            if (data.status === 'success') {
                document.getElementById('script-output').innerHTML = `<strong>Infos :</strong> ${data.message}`;
                if (data.data && data.data.code_obtenu) {
                    document.getElementById('script-output').innerHTML += `<br><strong>Code obtenu :</strong> ${data.data.code_obtenu}`;
                }
            } else {
                document.getElementById('script-output').innerHTML = `<strong>Erreur :</strong> ${data.message}`;
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);

            // Réactiver les boutons et restaurer le bouton "Run" en cas d'erreur
            runBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
            runBtn.disabled = false;
            editBtn.disabled = false;

            document.getElementById('script-output').innerHTML = 'Une erreur est survenue lors de l\'exécution du script.';
        });
});
