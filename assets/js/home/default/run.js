document.getElementById('run-script-default-btn').addEventListener('click', function () {
    const scriptName = document.getElementById('script-select-default').value;

    fetch('/run-script-default', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            'script_name': scriptName
        })
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('script-output').innerHTML = data;
            document.getElementById('console-output').textContent = data;
        })
        .catch((error) => {
            console.error('Erreur:', error);
            document.getElementById('script-output').innerHTML = 'Une erreur est survenue lors de l\'exécution du script.';
            document.getElementById('console-output').textContent = 'Erreur: ' + error;
        });
});