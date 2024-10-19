document.getElementById('clear-token-base64-input').addEventListener('click', function () {
    const inputField = document.getElementById('token-base64-input');
    inputField.value = '';  // Vider le champ de texte
    inputField.focus();     // Redonner le focus à l'input après avoir vidé
});
