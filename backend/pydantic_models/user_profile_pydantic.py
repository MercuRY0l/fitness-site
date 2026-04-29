
from pydantic import BaseModel


class UserProfile(BaseModel):
    age : int
    height : float
    weight : float
    gender : str
    goal : str
    