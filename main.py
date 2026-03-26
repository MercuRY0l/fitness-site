import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from contextlib import asynccontextmanager

from backend.database.connect import init_models

from backend.routers.main_page_router import main_page_router
from backend.routers.training_page_router import training_page_router
from backend.routers.registration_router import reg_router
from backend.routers.login_router import login_router
from backend.routers.refresh_token_router import refresh_token_router
from backend.routers.logout_router import logout_router


@asynccontextmanager
async def lifespan(app : FastAPI):
    await init_models()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(main_page_router)
app.include_router(training_page_router)
app.include_router(reg_router)
app.include_router(login_router)
app.include_router(refresh_token_router)
app.include_router(logout_router)

app.mount("/static", StaticFiles(directory="frontend/static"), name="static")


if __name__ == "__main__":
    uvicorn.run(app=app, host="localhost", port=5000)
    