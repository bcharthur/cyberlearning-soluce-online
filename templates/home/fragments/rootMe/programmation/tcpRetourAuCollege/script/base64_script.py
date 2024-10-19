#base 64

import requests  # Pour faire des requêtes HTTP
from bs4 import BeautifulSoup  # Pour parser le HTML
import base64  # Pour décoder les chaînes en base64
import re  # Pour les expressions régulières
import sys  # Pour gérer les interruptions du script et récupérer les arguments
import time  # Pour ajouter une pause entre les tentatives
import json  # Pour formater les sorties en JSON

# Récupérer le jeton en tant qu'argument depuis le contrôleur Symfony
if len(sys.argv) < 2:
    print(json.dumps({
        'status': 'error',
        'message': 'Jeton manquant. Veuillez fournir un jeton.'
    }))
    sys.exit(1)

jeton = sys.argv[1]  # Récupérer le jeton fourni en paramètre
url = f'https://cyber-learning.fr/cyber-challenge/programmation/b64/sujet.php?jeton={jeton}'

# Fonction pour renvoyer une réponse JSON et quitter le script
def return_json(status, message, data=None):
    response = {
        'status': status,
        'message': message
    }
    if data is not None:
        response['data'] = data
    print(json.dumps(response))
    sys.exit(0 if status == 'success' else 1)

# Créer une session pour conserver les cookies et autres informations de session
session = requests.Session()

def extract_code_between_brackets(text):
    """Utilise une expression régulière pour extraire le texte entre crochets []"""
    match = re.search(r'\[(.*?)\]', text)
    return match.group(1) if match else 'Code non trouvé'

def main():
    while True:
        start_time = time.time()  # Enregistrer l'heure de début pour mesurer le temps écoulé
        try:
            # Récupérer le contenu de la page
            response = session.get(url)
            response.raise_for_status()  # Vérifie si la requête a réussi
            soup = BeautifulSoup(response.text, 'html.parser')

            # Rechercher la chaîne de caractères en base64 dans le texte brut de la page
            base64_pattern = re.compile(r'Décodez : RkxBRyA9([A-Za-z0-9+/=]+)')
            match = base64_pattern.search(response.text)

            if not match:
                raise ValueError("La chaîne de caractères en base64 n'a pas été trouvée.")

            base64_string = match.group(1)

            # Décoder la chaîne de caractères en base64
            decoded_bytes = base64.b64decode(base64_string)
            decoded_string = decoded_bytes.decode('utf-8')

            # Préparer les données pour le formulaire
            form_data = {'resultat': decoded_string}

            # Soumettre le formulaire
            response = session.post(url, data=form_data)
            response.raise_for_status()  # Vérifie si la requête a réussi

            # Vérifier si le message "BRAVO" est présent dans la réponse
            if "BRAVO" in response.text:
                code_obtenu = extract_code_between_brackets(response.text)
                return_json(
                    status='success',
                    message='Formulaire soumis avec succès.',
                    data={'code_obtenu': code_obtenu}
                )
            else:
                return_json(
                    status='error',
                    message='Échec lors de la soumission du formulaire.'
                )

        except requests.RequestException as e:
            return_json(
                status='error',
                message=f'Erreur lors de la requête HTTP : {e}'
            )

        except (ValueError, base64.binascii.Error) as e:
            return_json(
                status='error',
                message=f'Erreur lors du traitement des données : {e}'
            )

        except Exception as e:
            return_json(
                status='error',
                message=f'Erreur inattendue : {e}'
            )

        finally:
            # Pause pour éviter de surcharger le serveur
            time_elapsed = time.time() - start_time
            if time_elapsed < 1.5:
                time.sleep(1.5 - time_elapsed)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        return_json(
            status='error',
            message='Script interrompu par l\'utilisateur.'
        )