
from ..connect import async_session
from ..models import Workout_Exercises
from sqlalchemy import select, delete

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

    async def remove_exercise(self, workout_exercise_id: int):
        async with async_session() as session:
            stmt = delete(Workout_Exercises).where(
                Workout_Exercises.id == workout_exercise_id
            )
            res = await session.execute(stmt)
            await session.commit()
            return res.rowcount
                 