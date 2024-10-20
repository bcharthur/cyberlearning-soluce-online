document.getElementById('run-script-tcpRetourAuCollege-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-tcpRetourAuCollege').value;

    // Désactiver les boutons pendant le chargement
    const runBtn = document.getElementById('run-script-tcpRetourAuCollege-btn');
    runBtn.disabled = true;

    // Ajouter le spinner dans le bouton "Run"
    runBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    fetch('/run-script-tcpRetourAuCollege', {
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
            // Remettre le bouton à son état initial
            runBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
            runBtn.disabled = false;

            if (data.status === 'success') {
                document.getElementById('script-output-tcpRetourAuCollege').innerHTML = `<strong>Infos :</strong> ${data.message}`;

                // Si la sortie brute est incluse dans la réponse
                if (data.data && data.data.output) {
                    const output = data.data.output;

                    document.getElementById('script-output-tcpRetourAuCollege').innerHTML += `
                        <br><strong>Sortie brute :</strong><pre>${output}</pre>`;

                    // Rechercher la ligne contenant "Good job" et le flag
                    const flagLine = output.match(/\[\+\] Good job ! Here is your flag: (.*)/);
                    if (flagLine) {
                        const flag = flagLine[1];
                        document.getElementById('script-output-tcpRetourAuCollege').innerHTML += `
                            <br><strong class="bg-success text-white">Succès !</strong>
                            <br><strong>Flag :</strong> <span id="flag-text">${flag}</span>
                            <button type="button" class="btn btn-primary btn-sm ms-2" id="copy-flag-btn">
                                Copier
                            </button>`;

                        // Ajouter l'événement pour copier le flag
                        document.getElementById('copy-flag-btn').addEventListener('click', function () {
                            const flagText = document.getElementById('flag-text').innerText;
                            navigator.clipboard.writeText(flagText).then(() => {
                                const copyBtn = document.getElementById('copy-flag-btn');
                                copyBtn.innerHTML = 'Copié !';
                                copyBtn.classList.remove('btn-primary');
                                copyBtn.classList.add('btn-outline-primary');

                                // Revenir à l'état initial après 3 secondes
                                setTimeout(() => {
                                    copyBtn.innerHTML = 'Copier';
                                    copyBtn.classList.remove('btn-outline-primary');
                                    copyBtn.classList.add('btn-primary');
                                }, 3000);
                            }).catch((error) => {
                                console.error('Erreur lors de la copie :', error);
                            });
                        });
                    } else if (output.includes("Wrong answer")) {
                        document.getElementById('script-output-tcpRetourAuCollege').innerHTML += `
                            <br><strong class="bg-danger text-white">Échec !</strong>`;
                    }
                }
            } else {
                document.getElementById('script-output-tcpRetourAuCollege').innerHTML = `<strong>Erreur :</strong> ${data.message}`;
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);

            // Réactiver les boutons et restaurer le bouton "Run" en cas d'erreur
            runBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
            runBtn.disabled = false;

            document.getElementById('script-output-tcpRetourAuCollege').innerHTML = 'Une erreur est survenue lors de l\'exécution du script.';
        });
});
