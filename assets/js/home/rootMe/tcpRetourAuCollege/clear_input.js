document.getElementById('clear-token-tcpRetourAuCollege-input').addEventListener('click', function () {
    const inputField = document.getElementById('token-tcpRetourAuCollege-input');
    inputField.value = '';  // Vider le champ de texte
    inputField.focus();     // Redonner le focus à l'input après avoir vidé
});
