document.getElementById('copy-script-base64-btn').addEventListener('click', function () {
    const textarea = document.getElementById('script-content-show-base64');

    // Sélectionner le contenu du textarea
    textarea.select();
    textarea.setSelectionRange(0, 99999);  // Pour les mobiles

    try {
        // Copier dans le presse-papier
        const successful = document.execCommand('copy');

        // Activer le toast Bootstrap après la copie avec un délai de 5 secondes (5000 ms)
        const toastEl = document.getElementById('copy-toast-base64');
        const toast = new bootstrap.Toast(toastEl, {
            delay: 3000  // Délai en millisecondes (5 secondes)
        });

        if (successful) {
            toast.show(); // Affiche le toast si la copie est un succès
        } else {
            console.error('Erreur: échec de la copie');
        }
    } catch (err) {
        console.error('Erreur lors de la copie dans le presse-papier :', err);
    }

    // Désélectionner le contenu
    window.getSelection().removeAllRanges();
});
