

from fastapi import APIRouter
from fastapi.requests import Request
from fastapi.templating import Jinja2Templates

training_page_router = APIRouter()

templates = Jinja2Templates("frontend/templates")


@training_page_router.get("/training")
async def load_training_page(request : Request):
    return templates.TemplateResponse("training.html", {"request" : request})