import os
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from dotenv import load_dotenv
from models import Base

load_dotenv()

DB_ADMIN = os.getenv("DB_ADMIN")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")


DB_URL = f"posgressql+asyncpg://{DB_ADMIN}@{DB_PASSWORD}:{DB_HOST}/{DB_PORT}"

async_engine = create_async_engine(DB_URL, echo=True)
async_session = async_sessionmaker(bind=async_engine, expire_on_commit=False)

async def init_models():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)