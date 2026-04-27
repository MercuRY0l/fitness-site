

import jwt

from fastapi import HTTPException, Cookie

from ..jwt import SECRET_KEY, ALGORITHM
from ..database.repositories.user_repo import UserRepository

async def get_current_user(access_token : str = Cookie(None)):
    
    try:
        
        if not access_token:
            raise HTTPException(status_code=401, detail={"error" : "Access токен не найден"})
        
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
    
        if (payload.get("type") != "access"):
            raise HTTPException(status_code=401, detail={"error" : "Пользователь не авторизован"})
        
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail={"error" : "Пользователь не авторизован"})
        
        repo = UserRepository()
        
        user = await repo.find_user_by_id(user_id=user_id)
        
        if not user:
            raise HTTPException(status_code=401, detail={"error": "Пользователь не найден"})
        
        return user
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail={"error": "Срок действия токена истёк"})
    
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail={"error": "Неверный токен"})