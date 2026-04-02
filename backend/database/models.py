
from datetime import datetime
from sqlalchemy import Integer, String, DateTime, func, ForeignKey
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped, relationship

class Base(DeclarativeBase):
    pass


class Users(Base):
    __tablename__ = "users"
    
    id : Mapped[int] = mapped_column(Integer, primary_key=True)
    login : Mapped[str] = mapped_column(String(255), nullable=False , unique=True)
    email : Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password : Mapped[str] = mapped_column(String(255) , nullable=False)
    created_at : Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now())
    
    workouts : Mapped[list["Workouts"]] = relationship("Workouts", back_populates="user")

class Exercises(Base):
    
    __tablename__ = "exercises"
    
    id : Mapped[int] = mapped_column(Integer, primary_key=True)
    title : Mapped[str] = mapped_column(String(255), nullable=False , unique=True)
    description : Mapped[str] = mapped_column(String(512), nullable=False)
    difficulty : Mapped[int] = mapped_column(Integer(10), nullable=False)
    image : Mapped[str] = mapped_column(String(255))
    
    workouts : Mapped[list["Workout_Exercises"]] = relationship("Workouts", back_populates="exercise")

class Workouts(Base):
    
    __tablename__ = "workouts"
    
    id : Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id : Mapped[int] = mapped_column(nullable=False)
    title : Mapped[str] = mapped_column(String(255), nullable=False)
    date : Mapped[int] = mapped_column(DateTime, nullable=False)
    created_at : Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    
    user : Mapped[list["Users"]] = relationship("Users", back_populates="workouts")
    exercises : Mapped[list["Workout_Exercises"]] = relationship("Exercises", back_populates="workout")
    
class Workout_Exercises(Base):
    __tablename__ = "workout_exercises"
    
    id : Mapped[int] = mapped_column(Integer, primary_key=True)
    workout_id : Mapped[int] = mapped_column(Integer, ForeignKey("workouts.id"))
    exercise_id : Mapped[int] = mapped_column(Integer, ForeignKey("exercises.id"))
    
    sets : Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    reps : Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    
    workout = Mapped[list["Workout_Exercises"]] = relationship("Workouts", back_populates="exercises")
    exercise : Mapped[list["Workout_Exercises"]] = relationship("Exercises", back_populates="workouts")
    
    
    