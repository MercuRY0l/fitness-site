
import jwt
import os
import datetime

from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta

from fastapi import HTTPException


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRES = 15
REFRESH_TOKEN_EXPIRES = 7

def create_token(data: dict, expires_delta : int):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp" : expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def update_token(refresh_token : str):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload.get("user_id"))
        user_login = str(payload.get("login"))
        user_email = str(payload.get("email"))
    
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail={"error" : "Refresh токен истек!"})
    except jwt.PyJWKError:
        raise HTTPException(status_code=401, detail={"error" : "Неверный refresh токен!"})
    
    access_token = create_token({"user_id" : user_id, "login" : user_login, "email" : user_email, "type" : "access"}, timedelta(minutes=ACCESS_TOKEN_EXPIRES))
    return access_token


