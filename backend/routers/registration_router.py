


from fastapi import APIRouter, HTTPException
from ..database.repositories.user_repo import UserRepository
from ..pydantic_models.reg_pydantic import RegistrationUser

from ..hasher import hash_password

reg_router = APIRouter()

@reg_router.post("/auth/register", status_code=201)
async def registration(data : RegistrationUser):
    repo = UserRepository()
    
    if await repo.find_user_by_username(data.login) is not None:
        raise HTTPException(status_code=409, detail={"error" : "Пользователь уже существует!"})
    
    if data.password != data.password_repeat:
        raise HTTPException(status_code=400, detail={"error" : "Пароли не совпадают!"})
    
    hashed_password = hash_password(password=data.password)
    
    
    await repo.create_user(login=data.login, email=data.email, password=hashed_password)
    
    return {"message" : "Пользователь успешно создан!"}



