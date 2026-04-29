from ..connect import async_session
from ..models import Users
from sqlalchemy import select, delete

class UserRepository:
    async def find_user_by_id(self, user_id : int) -> Users:
        async with async_session() as session:
            stmt = select(Users).where(Users.id == user_id)
            res = await session.execute(stmt)
            return res.scalars().one_or_none()
        
    async def find_user_by_username(self , login: str) -> Users:
        async with async_session() as session:
            stmt = select(Users).where(Users.login == login)
            res = await session.execute(stmt)
            return res.scalars().one_or_none()
    
    async def create_user(self, login : str, email : str, password : str):
        async with async_session() as session:
            user = Users(login=login, email=email, password=password)
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
    