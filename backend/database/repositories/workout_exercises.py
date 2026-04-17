
from ..connect import async_session
from ..models import Workout_Exercises
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload

from typing import Optional

class WorkoutExercisesRepository:
    
    
    async def add_exercise_to_workout(
        self,
        workout_id: int,
        exercise_id: int,
        sets: int = 3,
        reps: int = 10
    ):
        async with async_session() as session:
            link = Workout_Exercises(
                workout_id=workout_id,
                exercise_id=exercise_id,
                sets=sets,
                reps=reps
            )
            session.add(link)
            await session.commit()
            await session.refresh(link)
            return link

    async def get_workout_exercises(self, workout_id: int):
        async with async_session() as session:
            stmt = select(Workout_Exercises).where(
                Workout_Exercises.workout_id == workout_id
            )
            res = await session.execute(stmt)
            return res.scalars().all()

    async def get_workout_exercise(self, exercise_id: int):
        async with async_session() as session:
            stmt = select(Workout_Exercises).where(
                Workout_Exercises.exercise_id == exercise_id
            )
            res = await session.execute(stmt)
            return res.scalar_one_or_none()
    
    async def remove_exercise(self, workout_exercise_id: int):
        async with async_session() as session:
            stmt = delete(Workout_Exercises).where(
                Workout_Exercises.id == workout_exercise_id
            )
            res = await session.execute(stmt)
            await session.commit()
            return res.rowcount
                 
                 
    async def update_exercises_in_workout(self, exercise_id:int , workout_reps : int | None = None, workout_sets : int | None = None):
        async with async_session() as session:
            exercise = await self.get_workout_exercise(exercise_id=exercise_id)
            
            if (not exercise):
                return None
            
            if (workout_reps is not None):
                self.reps = workout_reps
            
            if (workout_sets is not None):
                self.sets = workout_sets
            
            session.commit()
            session.refresh(exercise)
            
            return exercise
            
            
            
            