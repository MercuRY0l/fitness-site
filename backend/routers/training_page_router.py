

from fastapi import APIRouter, Depends
from fastapi.requests import Request
from fastapi.templating import Jinja2Templates
from ..routers.login_router import get_current_user

training_page_router = APIRouter()

templates = Jinja2Templates("frontend/templates")

@training_page_router.get("/training")
async def load_training_page(request : Request, current_user : dict = Depends(get_current_user)):
    return templates.TemplateResponse("training.html", {"request" : request, "user" : current_user})