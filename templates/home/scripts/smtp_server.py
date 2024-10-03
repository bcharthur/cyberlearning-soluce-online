import asyncore
import smtpd
import sys

class CustomSMTPServer(smtpd.SMTPServer):
    def process_message(self, peer, mailfrom, rcpttos, data):
        print(f"Reçu un email de: {mailfrom}")
        print(f"Envoyé à: {rcpttos}")
        print(f"Message: {data}")
        return

if __name__ == '__main__':
    # Port par défaut (peut être modifié via des arguments de ligne de commande)
    port = 1025

    # Vérifier si un port a été passé en argument
    if len(sys.argv) > 1:
        port = int(sys.argv[1])

    # Démarrage du serveur SMTP
    server = CustomSMTPServer(('localhost', port), None)
    print(f"Serveur SMTP démarré sur le port {port}...")

    try:
        asyncore.loop()  # Boucle du serveur pour accepter les connexions
    except KeyboardInterrupt:
        print("Serveur SMTP arrêté.")
