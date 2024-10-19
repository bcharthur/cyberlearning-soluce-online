document.getElementById('run-script-base64-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-base64').value;
    const token = document.getElementById('token-base64-input').value;  // Récupérer le jeton

    if (!token) {
        alert("Base 64 : Veuillez entrer un jeton valide !");
        return;
    }

    // Désactiver les boutons pendant le chargement
    const runBtn = document.getElementById('run-script-base64-btn');
    const editBtn = document.getElementById('edit-script-base64-btn');
    runBtn.disabled = true;
    editBtn.disabled = true;

    // Ajouter le spinner dans le bouton "Run"
    runBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    fetch('/run-script-base64', {
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
            // Réinitialiser le bouton "Run" et réactiver les boutons
            runBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
            runBtn.disabled = false;
            editBtn.disabled = false;

            // Mettre à jour la sortie du script
            if (data.status === 'success') {
                document.getElementById('script-output-base64').innerHTML = `<strong>Infos :</strong> ${data.message}`;
                if (data.data && data.data.code_obtenu) {
                    document.getElementById('script-output-base64').innerHTML += `<br><strong>Code obtenu :</strong> ${data.data.code_obtenu}`;
                }else{
                    document.getElementById('script-output-base64').innerHTML = `<strong>Infos :</strong> Erreur dans le Jeton`;
                }
            } else {
                document.getElementById('script-output-base64').innerHTML = `<strong>Erreur :</strong> ${data.message}`;
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);

            // Réactiver les boutons et restaurer le bouton "Run" en cas d'erreur
            runBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
            runBtn.disabled = false;
            editBtn.disabled = false;

            document.getElementById('script-output-base64').innerHTML = 'Une erreur est survenue lors de l\'exécution du script.';
        });
});
