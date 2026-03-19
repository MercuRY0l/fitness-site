

from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

main_page_router = APIRouter()

templates = Jinja2Templates("frontend/templates")

@main_page_router.get("/")
async def load_main_page(request : Request):
    return templates.TemplateResponse("index.html", {"request" : request})

