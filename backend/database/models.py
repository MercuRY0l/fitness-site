
from datetime import datetime
from sqlalchemy import Integer, String, DateTime, Float, func, ForeignKey
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
    profile : Mapped["UsersProfiles"] = relationship("UsersProfiles", back_populates="user", uselist=False)

class UsersProfiles(Base):
    __tablename__ = "users_profiles"

    id : Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id : Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False , unique=True)
    name : Mapped[str] = mapped_column(String(255), nullable=False)
    age : Mapped[int] = mapped_column(Integer, nullable=False)
    height : Mapped[int] = mapped_column(Integer , nullable=False)
    weight : Mapped[int] = mapped_column(Integer, nullable=False)
    gender : Mapped[str] = mapped_column(String(255), nullable=False)
    goal : Mapped[str] = mapped_column(String(255), nullable=False)
    created_at : Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now())
    
    user : Mapped["Users"] = relationship("Users", back_populates="profile")
    
class Exercises(Base):
    
    __tablename__ = "exercises"
    
    id : Mapped[int] = mapped_column(Integer, primary_key=True)
    title : Mapped[str] = mapped_column(String(255), nullable=False , unique=True)
    description : Mapped[str] = mapped_column(String(512), nullable=False)
    difficulty : Mapped[int] = mapped_column(Integer, nullable=False)
    image : Mapped[str] = mapped_column(String(255))
    
    workouts: Mapped[list["Workouts"]] = relationship(
    "Workouts",
    secondary="workout_exercises",
    back_populates="exercises"
    )

    workout_links: Mapped[list["Workout_Exercises"]] = relationship(
        "Workout_Exercises",
        back_populates="exercise"
    )

class Workouts(Base):
    
    __tablename__ = "workouts"
    
    id : Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id : Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    title : Mapped[str] = mapped_column(String(255), nullable=False)
    date : Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    created_at : Mapped[DateTime] = mapped_column(DateTime(timezone=True), default=func.now())
    
    user : Mapped["Users"] = relationship("Users", back_populates="workouts")
    
    exercises: Mapped[list["Exercises"]] = relationship(
    "Exercises",
    secondary="workout_exercises",
    back_populates="workouts"
    )

    exercise_links: Mapped[list["Workout_Exercises"]] = relationship(
    "Workout_Exercises",
    back_populates="workout"
    )
    
class Workout_Exercises(Base):
    __tablename__ = "workout_exercises"
    
    id : Mapped[int] = mapped_column(Integer, primary_key=True)
    workout_id : Mapped[int] = mapped_column(Integer, ForeignKey("workouts.id"))
    exercise_id : Mapped[int] = mapped_column(Integer, ForeignKey("exercises.id"))
    
    sets : Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    reps : Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    
    workout: Mapped["Workouts"] = relationship(
    "Workouts",
    back_populates="exercise_links"
    )

    exercise: Mapped["Exercises"] = relationship(
    "Exercises",
    back_populates="workout_links"
    )
    
    
    