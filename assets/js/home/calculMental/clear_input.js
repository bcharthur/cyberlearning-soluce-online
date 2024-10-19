document.getElementById('clear-token-calculMental-input').addEventListener('click', function () {
    const inputField = document.getElementById('token-calculMental-input');
    inputField.value = '';  // Vider le champ de texte
    inputField.focus();     // Redonner le focus à l'input après avoir vidé
});
