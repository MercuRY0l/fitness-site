

from fastapi import APIRouter, Request, Depends
from fastapi.templating import Jinja2Templates

from .deps import get_current_user

from ..database.repositories.weight_repo import WeightHistoryRepository

from ..pydantic_models.weight_pydantic import WeightCreate

weight_page_router = APIRouter()

templates = Jinja2Templates("frontend/templates")

@weight_page_router.get("/user/weight")
async def load_weight_page(request : Request):
    return templates.TemplateResponse("weight_page.html", {"request" : request})


@weight_page_router.post("/user/weight/create")
async def create_weight(data : WeightCreate, current_user : dict = Depends(get_current_user)):
    repo = WeightHistoryRepository()
    return await repo.create(user_id=current_user.id, weight=data.weight)

@weight_page_router.delete("/user/weight/delete")
async def delete_weith(current_user : dict = Depends(get_current_user)):
    repo = WeightHistoryRepository()
    await repo.delete(user_id=current_user.id)
    
@weight_page_router.get("/user/weight/get")
async def get_weight(current_user : dict = Depends(get_current_user)):
    repo = WeightHistoryRepository()
    return await repo.get_weight(user_id=current_user.id)