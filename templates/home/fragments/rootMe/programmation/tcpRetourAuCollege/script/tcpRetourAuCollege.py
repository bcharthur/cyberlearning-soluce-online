#tcp retour au college

import re
import math
from pwn import remote

# Connexion à l'hôte et au port du challenge
HOST = 'challenge01.root-me.org'
PORT = 52002

# Connexion TCP
conn = remote(HOST, PORT)

# Réception de la question mathématique depuis le serveur
prompt = conn.recvuntil('= ').decode()
print(prompt)

# Extraction des nombres dans le prompt avec une regex
numbers = re.findall(r'\d+', prompt)

# Conversion des nombres extraits
num1 = int(numbers[1])
num2 = int(numbers[2])

# Calcul du résultat demandé (racine carrée du premier nombre multipliée par le second)
result = round(math.sqrt(num1) * num2, 2)
print(f"Answer: {result}")

# Envoi du résultat au serveur
conn.sendline("{:.2f}".format(result))

# Réception de la réponse du serveur
response = conn.recvline().decode()
print(response)

# Fermeture de la connexion
conn.close()

