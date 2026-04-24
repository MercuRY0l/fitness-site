

from datetime import datetime,timezone

from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.requests import Request
from fastapi.templating import Jinja2Templates

from .login_router import get_current_user

from backend.database.repositories.exercise_repo import ExerciseRepository
from backend.database.repositories.workout_exercises import WorkoutExercisesRepository
from backend.database.repositories.workout_repo import WorkoutRepository

from ..pydantic_models.exercises_pydantic import ExercisesToWorkout, ExerciseFromWorkout
from ..pydantic_models.workout_pydantic import WorkoutPydantic, WorkoutResponse
from ..pydantic_models.exercise_pydantic import ExerciseOut


workout_page_router = APIRouter()

templates = Jinja2Templates("frontend/templates")



@workout_page_router.get("/exercises")
async def search_exercise(query: str = Query(...)):
    repo = ExerciseRepository()
    
    query_lower = query.lower()
    exercises = await repo.search_exercise(query_lower)
    
    if (not exercises):
        return {"message" : "Упражнения не найдены"}
    
    return[{
        "exercise_id": ex.id,
        "exercise_title" : ex.title,
        "exercise_description": ex.description,
        "exercise_difficulty": ex.difficulty,
        "exercise_image" : ex.image
    } for ex in exercises
    ]
    
    
@workout_page_router.post("/exercises/add-to-workout")
async def add_new_exercise(data : ExercisesToWorkout):
    exerices_repo = ExerciseRepository()
    workout_ex_repo = WorkoutExercisesRepository()
    workout_repo = WorkoutRepository()

    workout = await workout_repo.find_workout_by_id(data.workout_id)
    
    if (not workout):
        raise HTTPException(status_code=404, detail="Тренировка не найдена")
    
    
    exercise = await exerices_repo.find_exercise_by_id(data.exercise_id)
    if (not exercise):
        raise HTTPException(status_code=404, detail="Упражнение не найдено")
    
    await workout_ex_repo.add_exercise_to_workout(workout_id=data.workout_id, exercise_id=data.exercise_id, sets=data.sets, reps=data.reps)
    return {"message" : "Упражнение успешно добавлено в тренировку"}
     

@workout_page_router.delete("/exercises/delete")
async def delete_exercise_from_workout(data : ExercisesToWorkout):
    repo = WorkoutExercisesRepository()
    
    if (not data.exercise_id):
        raise HTTPException(status_code=404, detail="Упражнение не найдено")
    
    await repo.remove_exercise(data.exercise_id)
    return {"message" : "Упражнение успешно удалено из тренировки"}

@workout_page_router.put("/exercises/update")
async def update_exercise(data : ExerciseFromWorkout):
    repo = WorkoutExercisesRepository()
    
    if (not data):
        raise HTTPException(status_code=404, detail="Упражнение на найдено")
    
    await repo.update_exercises_in_workout(data.exercise_id, workout_reps=data.exercise_reps, workout_sets=data.exercise_sets)    
    return {"message" : "Успешное обновление данных в упражнении"}
    

@workout_page_router.get("/all_workouts")
async def load_all_workouts_page(request: Request, current_user : dict = Depends(get_current_user)):
    return templates.TemplateResponse("all_workouts_page.html", {"request" : request, "user" : current_user})

@workout_page_router.get("/workouts")
async def load_training_page(request : Request, current_user : dict = Depends(get_current_user)):
    return templates.TemplateResponse("workout_page.html", {"request" : request, "user" : current_user})

     
@workout_page_router.post("/workouts/create")
async def add_new_training(data : WorkoutPydantic, current_user: dict = Depends(get_current_user)):
    workout_repo = WorkoutRepository()
    
    existing = await workout_repo.find_workout_by_title(data.title)

    if existing:
        return {
            "id": existing.id,
            "message": "Тренировка уже существует"
        }
    
    workout = await workout_repo.create_workout(user_id=current_user.id, title=data.title, date=data.date, created_at=datetime.now(timezone.utc))
    return workout


@workout_page_router.delete("/workout/delete/{workout_id}")
async def delete_workout(workout_id : int):
    repo = WorkoutRepository()
    
    await repo.delete_workout_by_workout_id(workout_id=workout_id)
    return {"message" : "Тренировка успешно удалена"}


@workout_page_router.get("/workouts/all", response_model=list[WorkoutResponse])
async def get_workouts(current_user : dict = Depends(get_current_user)):
    workout_repo = WorkoutRepository()
    return await workout_repo.find_three_workouts_by_user_id(current_user.id)
    

@workout_page_router.get("/workouts/last")
async def get_last_workout(current_user : dict = Depends(get_current_user)):
    workout_repo = WorkoutRepository()
    return await workout_repo.find_last_workout(current_user.id)

@workout_page_router.get("/workouts/{workout_id}/exercises" , response_model = list[ExerciseOut])
async def get_exercises_in_workout(workout_id : int, current_user : dict = Depends(get_current_user)):
    workout_repo = WorkoutExercisesRepository()
    return await workout_repo.get_exercises_by_workout_id(workout_id=workout_id, user_id=current_user.id)
    
@workout_page_router.delete("/workouts/{workout_id}/exercises/{exercise_id}")
async def delete_exercise_from_workout(workout_id : int , exercise_id : int):
    workout_exercises_repo = WorkoutExercisesRepository()
    
    if (not exercise_id):
        raise HTTPException(status_code=404, detail={"error" : "Exercise_id не найден"})
    
    if (not workout_id):
        raise HTTPException(status_code=404, detail={"error" : "Workout_id не найден"})
    
    res = await workout_exercises_repo.delete_exercise_from_workout(workout_id=workout_id, exercise_id=exercise_id)
    
    if res == 0:
        raise HTTPException(
            status_code=404,
            detail="Упражнение не найдено в тренировке"
        )

    return {
        "message": "Упражнение успешно удалено из тренировки"
    }
    