

from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates

from .deps import get_current_user

from ..database.repositories.user_profile_repo import UserProfileRepository
from ..pydantic_models.user_profile_pydantic import UserProfile

user_profile_router = APIRouter()

templates = Jinja2Templates("frontend/templates")

@user_profile_router.get("/user/profile")
async def load_main_page(request : Request):
    return templates.TemplateResponse("user_profile_page.html", {"request" : request})

@user_profile_router.post("/user/profile/create")
async def create_user_profile(profile : UserProfile, current_user : dict = Depends(get_current_user)):
    repo = UserProfileRepository()    
    await repo.create(user_id=current_user.id, name=profile.name, age=profile.age, height=profile.height, weight=profile.weight, gender=profile.gender, goal=profile.goal)
    
@user_profile_router.delete("/user/profile/delete")
async def delete_user_profile(current_user : dict = Depends(get_current_user)):
    repo = UserProfileRepository()
    await repo.delete(user_id=current_user.id)
    
@user_profile_router.patch("/user/profile/update")
async def update_user_profile(profile : UserProfile, current_user : dict = Depends(get_current_user)):
    repo = UserProfileRepository()
    data = profile.model_dump(exclude_unset=True)
    await repo.update(user_id=current_user.id, **data)
    
    
@user_profile_router.get("/user/profile/me")
async def get_profile(current_user : dict = Depends(get_current_user)):
    repo = UserProfileRepository()
    
    
    profile = await repo.get_by_user_id(user_id=current_user.id)

    if not profile:
        return None

    return {
        "name" : profile.name,
        "age": profile.age,
        "height": profile.height,
        "weight": profile.weight,
        "gender": profile.gender,
        "goal": profile.goal
    }