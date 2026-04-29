

from ..connect import async_session
from ..models import WeightHistory
from sqlalchemy import select, delete


class WeightHistoryRepository():
    
    async def create(self, user_id : int , weight : float) -> WeightHistory:
        async with async_session() as session:
            weight = WeightHistory(user_id=user_id, weight=weight)
            session.add(weight)
            await session.commit()
            await session.refresh(weight)
            return weight
    
    async def delete(self, user_id : int):
        async with async_session() as session:
            stmt = delete(WeightHistory).where(WeightHistory.user_id == user_id)
            res = await session.execute(stmt)
            await session.commit()
            return res.rowcount
    
    async def get_weight(self, user_id : int) -> WeightHistory:
        async with async_session() as session: 
            stmt = select(WeightHistory).where(WeightHistory.user_id == user_id)
            res = await session.execute(stmt)
            return res.scalars().all()