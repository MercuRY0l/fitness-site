

from pydantic import BaseModel, EmailStr, Field

class RegistrationUser(BaseModel):
    login : str = Field(min_length=6, max_length=30)
    email : EmailStr = Field(max_length=255)
    password : str = Field(min_length=6, max_length=255)
    password_repeat : str = Field(min_length=6, max_length=255)