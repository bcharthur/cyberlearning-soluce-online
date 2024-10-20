#tcp chaine encodee

from pwn import *
import base64

host = 'challenge01.root-me.org'
port = 52023

conn = remote(host, port)

conn.recvuntil("my string is '")
encoded_string = conn.recvuntil("'").strip(b"'").decode()
decoded_string = base64.b64decode(encoded_string).decode()

conn.sendline(decoded_string)

response = conn.recvall()
print(response)

conn.close()