from connect import async_session
from models import Users, Exercises
from sqlalchemy import select, delete
from datetime import datetime

class UserRepository:
    
    async def find_user_by_id(self, user_id : int) -> Users:
        async with async_session() as session:
            stmt = select(Users).where(Users.id == user_id)
            res = await session.execute(stmt)
            return res.scalars_one_or_none()
        
    
    async def create_user(self, username : str, login : str, email : str, password : str, created_at : datetime):
        async with async_session() as session:
            user = Users(username=username, login=login, email=email, password=password, created_at=created_at)
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user
    
    async def delete_user_by_user_id(self, user_id : int):
        async with async_session() as session:
            stmt = delete(Users).where(Users.id == user_id)
            res = await session.execute(stmt)
            await session.commit()
            return res.rowcount
            
            
            
class ExerciseRepository:
    async def find_exercise_by_id(self, exercise_id : int) -> Exercises:
        async with async_session() as session:
            stmt = select(Exercises).where(Exercises.id == exercise_id)
            res = await session.execute(stmt)
            return res.scalars_one_or_none()
        
    
    async def create_exercise(self, user_id : int, date : datetime, approaches : int, repetition : int, exercise : str):
        async with async_session() as session:
            ex = Exercises(user_id=user_id, date=date, approaches=approaches, repetition=repetition, exercise=exercise)
            session.add(ex)
            await session.commit()
            await session.refresh(ex)
            return ex
    
    async def delete_exercise_by_exercise_id(self, exercise_id : int):
        async with async_session() as session:
            stmt = delete(Exercises).where(Exercises.id == exercise_id)
            res = await session.execute(stmt)
            await session.commit()      
            return res.rowcount
                 