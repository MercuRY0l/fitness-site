
from pydantic import BaseModel
from datetime import date
from typing import Optional

from ..pydantic_models.exercises_pydantic import ExerciseFromWorkout

class WorkoutPydantic(BaseModel):
    title : str
    date : date
    
    
class WorkoutResponse(BaseModel):
    workout_id : int
    title : str
    date : date
    exercises : list[ExerciseFromWorkout]    