#Calcul mental

import requests  # Pour faire des requêtes HTTP
from bs4 import BeautifulSoup  # Pour parser le HTML
import time  # Pour les pauses et la mesure du temps
import sys  # Pour gérer les interruptions du script et récupérer les arguments
import json  # Pour formater les sorties en JSON

# Récupérer le jeton en tant qu'argument depuis le contrôleur Symfony
if len(sys.argv) < 2:
    print(json.dumps({
        'status': 'error',
        'message': 'Jeton manquant. Veuillez fournir un jeton.'
    }))
    sys.exit(1)

jeton = sys.argv[1]  # Récupérer le jeton fourni en paramètre
url = f'https://cyber-learning.fr/cyber-challenge/programmation/calcul/sujet.php?jeton={jeton}'

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

def main():
    while True:
        start_time = time.time()  # Enregistrer l'heure de début pour mesurer le temps écoulé

        try:
            # Récupérer le contenu de la page
            response = session.get(url)
            response.raise_for_status()  # Vérifie si la requête a réussi
            soup = BeautifulSoup(response.text, 'html.parser')

            # Rechercher la question mathématique
            question = None
            for line in soup.stripped_strings:
                if line.startswith("Combien font "):
                    question = line.split("Combien font ")[1].strip()
                    break

            if question is None:
                return_json(
                    status='error',
                    message="La question mathématique n'a pas été trouvée."
                )

            # Calculer la réponse attendue
            x, y = map(int, question.split(" x "))
            expected_result = x * y

            # Préparer les données pour le formulaire
            form_data = {
                'resultat': str(expected_result)
            }

            # Soumettre le formulaire
            response = session.post(url, data=form_data)
            response.raise_for_status()  # Vérifie si la requête a réussi

            # Afficher le résultat de la soumission et le contenu de la page
            soup = BeautifulSoup(response.text, 'html.parser')
            if "BRAVO" in response.text:
                code_obtenu = None
                result_tags = soup.find_all('b')
                for tag in result_tags:
                    if "BRAVO" in tag.text:
                        code_obtenu = tag.text.strip()
                        break
                return_json(
                    status='success',
                    message="Formulaire soumis avec succès.",
                    data={'code_obtenu': code_obtenu}
                )
            else:
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

        finally:
            # Pause pour respecter les limites de temps et éviter de surcharger le serveur
            time_elapsed = time.time() - start_time
            if time_elapsed < 1.5:  # Ajustez ce délai si nécessaire
                time.sleep(1.5 - time_elapsed)

            # Pause avant la prochaine itération (ajustez la durée selon vos besoins)
            time.sleep(0.5)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        return_json(
            status='error',
            message='Script interrompu par l\'utilisateur.'
        )
