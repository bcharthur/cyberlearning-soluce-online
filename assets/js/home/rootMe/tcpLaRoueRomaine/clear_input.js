document.getElementById('clear-token-tcpLaRoueRomaine-input').addEventListener('click', function () {
    const inputField = document.getElementById('token-tcpLaRoueRomaine-input');
    inputField.value = '';  // Vider le champ de texte
    inputField.focus();     // Redonner le focus à l'input après avoir vidé
});
