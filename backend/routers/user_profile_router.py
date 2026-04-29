

from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

user_profile_router = APIRouter()

templates = Jinja2Templates("frontend/templates")

@user_profile_router.get("/user/profile")
async def load_main_page(request : Request):
    return templates.TemplateResponse("user_profile_page.html", {"request" : request})

