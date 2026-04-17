
from ..connect import async_session
from ..models import Workouts, Workout_Exercises
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload

from datetime import datetime

class WorkoutRepository:
    
    async def find_workout_by_id(self, workout_id : int) -> Workouts:
        async with async_session() as session:
            stmt = select(Workouts).where(Workouts.id == workout_id)
            res = await session.execute(stmt)
            return res.scalars().one_or_none()
    
    
    async def find_three_workouts_by_user_id(self, user_id : int) -> Workouts:
        async with async_session() as session:
            stmt = select(Workouts).where(Workouts.user_id == user_id).options(selectinload(Workouts.exercise_links).selectinload(Workout_Exercises.exercise)).limit(3)
            res = await session.execute(stmt)
            workouts = res.scalars().unique().all()
            
            return [
            {
                "workout_id": w.id,
                "title": w.title,
                "date": w.date,
                "exercises": [
                    {
                        "exercise_id": l.exercise.id,
                        "image": l.exercise.image,
                        "title": l.exercise.title,
                        "sets": l.sets,
                        "reps": l.reps,
                    }
                    for l in w.exercise_links
                ],
            }
            for w in workouts
        ]
    
    async def find_workouts_by_user_id(self, user_id : int) -> Workouts:
        async with async_session() as session:
            stmt = select(Workouts).where(Workouts.user_id == user_id).options(selectinload(Workouts.exercise_links).selectinload(Workout_Exercises.exercise))
            
            res = await session.execute(stmt)
            workouts = res.scalars().unique().all()

            return [
            {
                "workout_id": w.id,
                "title": w.title,
                "date": w.date,
                "exercises": [
                    {
                        "exercise_id": l.exercise.id,
                        "image": l.exercise.image,
                        "title": l.exercise.title,
                        "sets": l.sets,
                        "reps": l.reps,
                    }
                    for l in w.exercise_links
                ],
            }
            for w in workouts
        ]
    
    async def create_workout(self, user_id : int, title : str, date : datetime, created_at : datetime):
        async with async_session() as session:
            ex = Workouts(user_id=user_id, title=title, date=date, created_at=created_at)
            session.add(ex)
            await session.commit()
            await session.refresh(ex)
            return ex
    
    async def find_workout_by_title(self, title) -> Workouts:
        async with async_session() as session:
            stmt = select(Workouts).where(Workouts.title == title)
            res = await session.execute(stmt)
            return res.scalars().one_or_none()
    
    async def delete_workout_by_workout_id(self, workout_id : int):
        async with async_session() as session:
            stmt = delete(Workouts).where(Workouts.id == workout_id)
            res = await session.execute(stmt)
            await session.commit()      
            return res.rowcount
    
    