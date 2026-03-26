
import jwt
import os
import datetime

from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGHORITHM = "HS256"

ACCESS_TOKEN_EXPIRES = 15
REFRESH_TOKEN_EXPIRES = 7

def create_token(data: dict, expires_delta : int):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp" : expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGHORITHM)
    return encoded_jwt


def update_token(refresh_token : str):
    pass    
