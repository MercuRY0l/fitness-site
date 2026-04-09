
from pydantic import BaseModel
from datetime import date

class WorkoutPydantic(BaseModel):
    user_id : int
    title : str
    workout_date : date