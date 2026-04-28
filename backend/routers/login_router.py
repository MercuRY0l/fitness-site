

from fastapi import APIRouter, HTTPException, Response, Depends
from ..database.repositories.user_repo import UserRepository
from ..pydantic_models.log_pydantic import LoginUser

from ..hasher import verify_password
from ..jwt import create_token, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES, SECRET_KEY, ALGORITHM

from datetime import timedelta, datetime, timezone

from .deps import get_current_user

login_router = APIRouter()

        

@login_router.get("/auth/me", status_code=200)
async def check_auth(current_user : dict = Depends(get_current_user)):
    return {
        "message": "Авторизован",
        "user": {
            "id": current_user.id,
            "username": current_user.login
        }
    }
    

@login_router.post("/auth/login", status_code=200)
async def login(response: Response , data : LoginUser):
    repo = UserRepository()
    
    user = await repo.find_user_by_username(data.login)
    
    if not user:
        raise HTTPException(status_code=409, detail={"error" : "Пользователь не найден!"})
    
    if (not verify_password(plain_password=data.password, hashed_password=user.password)):
        raise HTTPException(status_code=400, detail={"error" : "Неверный пароль!"})
    
    access_token = create_token({"user_id" : user.id, "login" : user.login,  "email" : user.email, "type" : "access"}, timedelta(minutes=ACCESS_TOKEN_EXPIRES))
    refresh_token = create_token({"user_id" : user.id, "login" : user.login,  "email" : user.email, "type" : "refresh"}, timedelta(days=REFRESH_TOKEN_EXPIRES))

    expire_refresh = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRES)
    expire_access = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRES)
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=expire_refresh,
        samesite="lax",
        secure=False, # на локальную разработку
        httponly=True,
        path="/"
    )
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        expires=expire_access,
        samesite="lax",
        secure=False,
        httponly=True,
        path="/"
    )
    
    return {"message" : "Пользователь успешно вошел!"}


