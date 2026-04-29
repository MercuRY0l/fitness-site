import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from contextlib import asynccontextmanager

from backend.database.connect import init_models

from backend.routers.main_page_router import main_page_router
from backend.routers.workout_page_router import workout_page_router
from backend.routers.registration_router import reg_router
from backend.routers.login_router import login_router
from backend.routers.refresh_token_router import refresh_token_router
from backend.routers.logout_router import logout_router
from backend.routers.user_profile_router import user_profile_router


@asynccontextmanager
async def lifespan(app : FastAPI):
    await init_models()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["http://localhost:5000"]
)

app.include_router(main_page_router)
app.include_router(workout_page_router)
app.include_router(reg_router)
app.include_router(login_router)
app.include_router(refresh_token_router)
app.include_router(logout_router)
app.include_router(user_profile_router)

app.mount("/static", StaticFiles(directory="frontend/static"), name="static")


if __name__ == "__main__":
    uvicorn.run(app=app, host="localhost", port=5000)
    
    
