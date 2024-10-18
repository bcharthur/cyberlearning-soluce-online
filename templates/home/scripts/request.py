# request.py

import requests  # Pour faire des requêtes HTTP
from bs4 import BeautifulSoup  # Pour parser le HTML
import sys  # Pour gérer les interruptions du script
import time  # Pour ajouter une pause entre les tentatives
import re  # Pour les expressions régulières
import json  # Pour formater les sorties en JSON

# Remplacez 'VOTRE_JETON_VALIDE' par votre jeton valide
jeton = 'VOTRE_JETON_VALIDE'
url = f'https://cyber-learning.fr/cyber-challenge/programmation/socket/sujet.php?jeton={jeton}'

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

# Vérification initiale du jeton
if jeton == 'VOTRE_JETON_VALIDE':
    return_json(
        status='error',
        message='Veuillez remplacer "VOTRE_JETON_VALIDE" par un jeton valide.'
    )

# Créer une session pour conserver les cookies et autres informations de session
session = requests.Session()

def main():
    attempt = 0

    while True:
        try:
            attempt += 1

            # Récupérer le contenu de la page
            response = session.get(url)
            response.raise_for_status()  # Vérifie si la requête a réussi
            soup = BeautifulSoup(response.text, 'html.parser')

            # Trouver le code à renvoyer
            target_section = soup.find('section', class_='cyberpunk black both')
            if not target_section:
                return_json(
                    status='error',
                    message='Section cible non trouvée dans la page.'
                )
            target_text = target_section.get_text()
            match = re.search(r'Renvoyer le code suivant \(qui n\'est pas le FLAG\) : ([A-Z]+)', target_text)
            if not match:
                return_json(
                    status='error',
                    message='Code cible non trouvé dans le texte.'
                )
            target_code = match.group(1)

            # Préparer les données pour le formulaire
            form_data = {
                'copie': target_code
            }

            # Soumettre le formulaire
            post_response = session.post(url, data=form_data)
            post_response.raise_for_status()  # Vérifie si la requête a réussi

            # Vérifier si le défi est réussi
            post_soup = BeautifulSoup(post_response.text, 'html.parser')
            post_text = post_soup.get_text()

            if "BRAVO" in post_text:
                bravo_match = re.search(r'BRAVO ! Vous pouvez utiliser ce code : \[(.*?)\]', post_text)
                if bravo_match:
                    code_obtenu = bravo_match.group(1)
                    return_json(
                        status='success',
                        message='Formulaire soumis avec succès.',
                        data={'code_obtenu': code_obtenu}
                    )
                else:
                    return_json(
                        status='error',
                        message='Code obtenu non trouvé dans la réponse.'
                    )
            else:
                # Si le défi n'est pas encore réussi, continuer
                time.sleep(0.5)  # Ajouter une pause pour éviter de surcharger le serveur
                continue

        except requests.HTTPError as e:
            if e.response.status_code == 500 and jeton != 'VOTRE_JETON_VALIDE':
                # Erreur serveur, probablement jeton invalide
                return_json(
                    status='error',
                    message='Jeton invalide ou erreur du serveur.'
                )
            else:
                return_json(
                    status='error',
                    message=f'Erreur lors de la requête HTTP : {str(e)}'
                )
        except requests.RequestException as e:
            return_json(
                status='error',
                message=f'Erreur lors de la requête HTTP : {str(e)}'
            )
        except ValueError as e:
            return_json(
                status='error',
                message=f'Erreur lors du traitement des données : {str(e)}'
            )
        except Exception as e:
            return_json(
                status='error',
                message=f'Erreur inattendue : {str(e)}'
            )

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        return_json(
            status='error',
            message='Script interrompu par l\'utilisateur.'
        )
