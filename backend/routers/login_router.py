


from fastapi import APIRouter, HTTPException, Response
from ..database.repository import UserRepository
from ..pydantic_models.log_pydantic import LoginUser

from ..hasher import verify_password
from ..jwt import create_token, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES

from datetime import timedelta, datetime, timezone

login_router = APIRouter()

@login_router.post("/auth/login", status_code=200)
async def login(response: Response , data : LoginUser):
    repo = UserRepository()
    
    user = await repo.find_user_by_username(data.login)
    
    if not user:
        raise HTTPException(status_code=409, detail={"error" : "Пользователь не найден!"})
    
    if (not verify_password(plain_password=data.password, hashed_password=user.password)):
        raise HTTPException(status_code=400, detail={"error" : "Неверный пароль!"})
    
    access_token = create_token({"user_id" : user.id, "login" : user.login,  "email" : user.email}, timedelta(minutes=ACCESS_TOKEN_EXPIRES))
    refresh_token = create_token({"user_id" : user.id, "login" : user.login,  "email" : user.email}, timedelta(days=REFRESH_TOKEN_EXPIRES))

    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRES)
    
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=expire,
        samesite="lax",
        secure=False, # на локальную разработку
        httponly=True
    )
    
    
    return {"message" : "Пользователь успешно вошел!", "access_token" : access_token, "token_type" : "bearer"}



