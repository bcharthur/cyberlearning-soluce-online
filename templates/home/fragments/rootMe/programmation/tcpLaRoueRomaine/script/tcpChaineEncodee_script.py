#tcp la roue romaine
import pwn


def decode_rot13(string):
    decoded = ""
    for char in string:
        if 'a' <= char <= 'z':
            decoded += chr((ord(char) - ord('a') + 13) % 26 + ord('a'))
        elif 'A' <= char <= 'Z':
            decoded += chr((ord(char) - ord('A') + 13) % 26 + ord('A'))
        else:
            decoded += char
    return decoded


# Paramètres de connexion
host = 'challenge01.root-me.org'
port = 52021

# Se connecter au challenge
conn = pwn.remote(host, port)
conn.recvuntil("string is '")
encoded_string = conn.recvuntil("'")[:-1].decode()

# Décoder la chaîne de caractères en ROT13
decoded_string = decode_rot13(encoded_string)

# Envoyer la réponse
conn.sendline(decoded_string)

# Récupérer et afficher la réponse du challenge
response = conn.recvall().decode()
print(response)