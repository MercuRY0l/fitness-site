
from datetime import datetime
from sqlalchemy import Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship

class Base(DeclarativeBase):
    pass


class Users(Base):
    
    __tablename__ = "users"
    
    id : Mapped[int] = mapped_column(primary_key=True)
    login : Mapped[str] = mapped_column(String(255), nullable=False)
    password : Mapped[str] = mapped_column(String(255) , nullable=False)
    created_at : Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now())
    
    exercises : Mapped[list["Exercises"]] = relationship(back_populates="user")

class Exercises(Base):
    
    __tablename__ = "exercises"
    
    id : Mapped[int] = mapped_column(primary_key=True)
    user_id : Mapped[int] = mapped_column(ForeignKey("users.id"))
    date : Mapped[datetime] = mapped_column()
    approaches : Mapped[int] = mapped_column()
    repetition : Mapped[int] = mapped_column()
    exercise : Mapped[str] = mapped_column()
    
    user: Mapped["Users"] = relationship(back_populates="exercises")
    
