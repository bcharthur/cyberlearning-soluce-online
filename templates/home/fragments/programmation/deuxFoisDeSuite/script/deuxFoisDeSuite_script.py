import requests
from bs4 import BeautifulSoup
import time
import sys
import json
import io

# Forcer l'encodage UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

if len(sys.argv) < 2:
    print(json.dumps({
        'status': 'error',
        'message': 'Jeton manquant. Veuillez fournir un jeton.'
    }, ensure_ascii=False))
    sys.exit(1)

jeton = sys.argv[1]
url = f'https://cyber-learning.fr/cyber-challenge/programmation/calcul2/sujet.php?jeton={jeton}'

def return_json(status, message, data=None):
    response = {
        'status': status,
        'message': message
    }
    if data is not None:
        response['data'] = data
    print(json.dumps(response, ensure_ascii=False))
    sys.exit(0 if status == 'success' else 1)

session = requests.Session()

def solve_math_question(soup):
    """
    Extrait et résout la question mathématique depuis le contenu HTML.
    """
    question = None
    for line in soup.stripped_strings:
        if line.startswith("Combien font "):
            question = line.split("Combien font ")[1].strip()
            break

    if question is None:
        raise ValueError("La question mathématique n'a pas été trouvée.")

    # Extraire les deux nombres et calculer le résultat
    x, y = map(int, question.split(" x "))
    return str(x * y)

def main():
    try:
        # Récupérer la page initiale
        response = session.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Résoudre la première question
        expected_result = solve_math_question(soup)

        # Soumettre la première réponse
        form_data = {'resultat': expected_result}
        response = session.post(url, data=form_data)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Vérifier si un deuxième calcul est demandé
        if "Pas mal... continuons" in response.text:
            # Résoudre le deuxième calcul
            expected_result = solve_math_question(soup)

            # Soumettre la deuxième réponse
            form_data = {'resultat': expected_result}
            response = session.post(url, data=form_data)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

        # Vérifier le succès après la deuxième soumission
        if "BRAVO" in response.text:
            for tag in soup.find_all('b'):
                if "BRAVO" in tag.text:
                    code_obtenu = tag.text.strip()
                    return_json(
                        status='success',
                        message='Formulaire soumis avec succès.',
                        data={'code_obtenu': code_obtenu}
                    )

        return_json(
            status='error',
            message="Échec de l'affichage du code obtenu."
        )

    except requests.RequestException as e:
        return_json(
            status='error',
            message=f"Erreur lors de la requête HTTP : {e}"
        )

    except ValueError as e:
        return_json(
            status='error',
            message=f"Erreur lors du traitement des données : {e}"
        )

    except Exception as e:
        return_json(
            status='error',
            message=f"Erreur inattendue : {e}"
        )

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        return_json(
            status='error',
            message='Script interrompu par l\'utilisateur.'
        )
