


from fastapi import APIRouter, HTTPException
from database.repository import UserRepository
from pydantic_models.reg_pydantic import RegistrationUser

from hasher import hash_password

reg_router = APIRouter()


@reg_router.post("auth/registration", status_code=201)
async def registration(data : RegistrationUser):
    repo = UserRepository()
    
    if repo.find_user_by_username(data.username) != None:
        raise HTTPException(status_code=409, detail={"error" : "Пользователь уже существует!"})
    
    if data.password != data.password_repeat:
        raise HTTPException(status_code=400, detail={"error" : "Пароли не совпадают!"})
    
    hashed_password = hash_password(password=data.password)
    
    await repo.create_user(data.username, data.email, hashed_password, data.password_repeat)
    
    return {"message" : "Пользователь успешно создан!"}



