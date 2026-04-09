

from pydantic import BaseModel

class ExercisesToWorkout(BaseModel):
    workout_id : int
    exercise_id : int
    reps : int
    sets : int