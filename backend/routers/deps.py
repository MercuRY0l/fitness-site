

import jwt

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

from ..jwt import create_token, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES, SECRET_KEY, ALGORITHM
from ..database.repository import UserRepository


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token : str = Depends(oauth2_scheme)):
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        
        if (payload.get("type") != "access"):
            raise HTTPException(status_code=401, detail={"error" : "Пользователь не авторизован"})
        
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail={"error" : "Пользователь не авторизован"})
        
        repo = UserRepository()
        
        user = await repo.find_user_by_id(user_id=user_id)
        return user
        
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401, detail={"error" : "Пользователь не авторизован"})