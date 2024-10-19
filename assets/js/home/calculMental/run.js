document.getElementById('run-script-calculMental-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-calculMental').value;
    const token = document.getElementById('token-calculMental-input').value;  // Récupérer le jeton

    // Si le champ du jeton est vide, afficher un message dans la sortie au lieu d'une alerte
    if (!token) {
        document.getElementById('script-output-calculMental').innerHTML = `<strong>Erreur :</strong> <span class="text-danger">Veuillez entrer un jeton valide !</span>`;
        return;  // Arrêter l'exécution du script ici
    }

    // Désactiver les boutons pendant le chargement
    const runBtn = document.getElementById('run-script-calculMental-btn');
    runBtn.disabled = true;

    // Ajouter le spinner dans le bouton "Run"
    runBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    fetch('/run-script-calculMental', {
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
            runBtn.disabled = false;

            if (data.status === 'success') {
                document.getElementById('script-output-calculMental').innerHTML = `<strong>Infos :</strong> ${data.message}`;

                if (data.data && data.data.code_obtenu) {
                    const code = data.data.code_obtenu;

                    document.getElementById('script-output-calculMental').innerHTML += `
                        <br>
                        <strong>Code obtenu :</strong>
                        <strong class="bg-success text-white">${code}</strong>
                        <button type="button" class="btn btn-primary" id="copy-script-calculMental-btn">
                            Copier
                        </button>`;

                    // Ajouter l'événement pour le bouton de copie
                    document.getElementById('copy-script-calculMental-btn').addEventListener('click', function () {
                        // Copier le code dans le presse-papier
                        navigator.clipboard.writeText(code).then(() => {
                            // Changer le style et le texte du bouton en "Copié !"
                            const copyBtn = document.getElementById('copy-script-calculMental-btn');
                            copyBtn.innerHTML = 'Copié !';
                            copyBtn.classList.remove('btn-primary');
                            copyBtn.classList.add('btn-outline-primary');

                            // Revenir à l'état initial après 3 secondes
                            setTimeout(() => {
                                copyBtn.innerHTML = `Copier`;
                                copyBtn.classList.remove('btn-outline-primary');
                                copyBtn.classList.add('btn-primary');
                            }, 3000);
                        }).catch((error) => {
                            console.error('Erreur lors de la copie :', error);
                        });
                    });
                } else {
                    document.getElementById('script-output-calculMental').innerHTML = `<strong>Infos :</strong> Erreur dans le Jeton`;
                }
            } else {
                document.getElementById('script-output-calculMental').innerHTML = `<strong>Erreur :</strong> ${data.message}`;
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);

            // Réactiver les boutons et restaurer le bouton "Run" en cas d'erreur
            runBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
            runBtn.disabled = false;

            document.getElementById('script-output-calculMental').innerHTML = 'Une erreur est survenue lors de l\'exécution du script.';
        });
});
