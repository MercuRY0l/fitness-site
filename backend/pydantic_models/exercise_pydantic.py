from pydantic import BaseModel

class ExerciseOut(BaseModel):
    title: str
    image : str
    sets : int
    reps : int