
from ..connect import async_session
from ..models import UsersProfiles
from sqlalchemy import select, delete
from sqlalchemy import update as sql_update



class UserProfileRepository():
    
    async def create(self, user_id : int, age : int, height : float , weight : float, gender : str, goal : str) -> UsersProfiles:
        async with async_session() as session:
            profile = UsersProfiles(user_id=user_id, age=age, height=height, weight=weight, gender=gender, goal=goal)
            session.add(profile)
            await session.commit()
            await session.refresh(profile)
            
            return profile
    
    async def delete(self, user_id : int):
        async with async_session() as session:
            stmt = delete(UsersProfiles).where(UsersProfiles.user_id == user_id)
            res = await session.execute(stmt)
            await session.commit()
            return res.rowcount
        
    async def get_by_user_id(self, user_id : int) -> UsersProfiles:
        async with async_session() as session:
            stmt = select(UsersProfiles).where(UsersProfiles.user_id == user_id)
            res = await session.execute(stmt)
            return res.scalar_one_or_none()
        
    async def update(self, user_id : int, **data):
        async with async_session() as session:
            stmt = sql_update(UsersProfiles).where(UsersProfiles.user_id == user_id).values(**data)
            await session.execute(stmt)
            await session.commit()