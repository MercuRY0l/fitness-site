
from typing import Optional
from pydantic import BaseModel


class ExercisesToWorkout(BaseModel):
    workout_id : int
    exercise_id : int
    reps : int
    sets : int
    
    
class ExerciseFromWorkout(BaseModel):
    exercise_id : int
    sets : Optional[int]
    reps : Optional[int]