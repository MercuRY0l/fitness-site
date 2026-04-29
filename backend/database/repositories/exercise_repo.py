
from ..connect import async_session
from ..models import Exercises
from sqlalchemy import select, delete

class ExerciseRepository:
    
    async def search_exercise(self, query : str) -> Exercises:
        async with async_session() as session:
                stmt = select(Exercises).where(
                    Exercises.title.ilike(f"%{query}%")
                )
                res = await session.execute(stmt)
                return res.scalars().all()
    
    async def find_exercise_by_id(self, exercise_id : int) -> Exercises:
        async with async_session() as session:
            stmt = select(Exercises).where(Exercises.id == exercise_id)
            res = await session.execute(stmt)
            return res.scalars().one_or_none()
        
    
    async def create_exercise(self, title : str, description : str, difficulty : int, image : str):
        async with async_session() as session:
            ex = Exercises(title=title, description=description, difficulty=difficulty, image=image)
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
                 