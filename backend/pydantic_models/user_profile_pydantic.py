
from pydantic import BaseModel


class UserProfile(BaseModel):
    name : str 
    age : int
    height : float
    weight : float
    gender : str
    goal : str
    