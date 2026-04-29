

from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

weight_page_router = APIRouter()

templates = Jinja2Templates("frontend/templates")

@weight_page_router.get("/user/weight")
async def load_weight_page(request : Request):
    return templates.TemplateResponse("weight_page.html", {"request" : request})

