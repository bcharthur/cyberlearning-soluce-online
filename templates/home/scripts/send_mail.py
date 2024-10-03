import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import sys

GMAIL_USER = 'eni.sortir.notif@gmail.com'
GMAIL_PASSWORD = 'vrnb ltsh uirh xnxa'  # Mot de passe d'application

def send_mail(from_email, to_email, subject, body):
    try:
        # Création de l'objet email
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        # Connexion au serveur Gmail
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_PASSWORD)

        # Envoi du mail
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()

        print(f"E-mail envoyé à {to_email} avec succès.")
    except Exception as e:
        print(f"Échec de l'envoi de l'e-mail : {e}")

if __name__ == "__main__":
    if len(sys.argv) == 5:
        from_email = sys.argv[1]
        to_email = sys.argv[2]
        subject = sys.argv[3]
        body = sys.argv[4]

        send_mail(from_email, to_email, subject, body)
    else:
        print("Usage : python send_mail.py <from_email> <to_email> <subject> <body>")
