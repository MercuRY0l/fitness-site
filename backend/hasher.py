

from pwdlib import PasswordHash

def get_hash_password():
    return PasswordHash.recommended()

def hash_password(password_hash, password):
    return password_hash.hash(password)
    
def verify_password(plain_password, hashed_password):
    password_hash = get_hash_password()
    return password_hash.verify(plain_password, hashed_password)