

from pydantic import BaseModel, EmailStr

class RegistrationUser(BaseModel):
    login : str
    email : EmailStr
    password : str
    password_repeat : str