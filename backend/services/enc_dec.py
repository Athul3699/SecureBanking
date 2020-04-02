import cryptography
from cryptography.fernet import Fernet

#generate the key
key = Fernet.generate_key()

#store the key
file = open('key.key', 'wb')
file.write(key) # The key is type bytes still
file.close()

#reading the key
file = open('key.key', 'rb')
key = file.read() # The key will be type bytes
file.close()

#encrypt
def enc(secret_key):
   message = secret_key.encode()
   global key
   f = Fernet(key)
   encrypted = f.encrypt(message)
   return encrypted

#decrypt
def dec(encrypted_secret):
   global key
   f = Fernet(key)
   decrypted = f.decrypt(encrypted_secret)
   return decrypted




