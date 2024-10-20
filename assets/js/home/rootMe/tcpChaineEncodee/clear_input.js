document.getElementById('clear-token-tcpChaineEncodee-input').addEventListener('click', function () {
    const inputField = document.getElementById('token-tcpChaineEncodee-input');
    inputField.value = '';  // Vider le champ de texte
    inputField.focus();     // Redonner le focus à l'input après avoir vidé
});
