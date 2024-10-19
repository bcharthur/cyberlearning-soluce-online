document.getElementById('clear-token-request-input').addEventListener('click', function () {
    const inputField = document.getElementById('token-request-input');
    inputField.value = '';  // Vider le champ de texte
    inputField.focus();     // Redonner le focus à l'input après avoir vidé
});
