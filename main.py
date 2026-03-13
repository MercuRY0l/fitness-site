import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers.main_page_router import main_page_router
from backend.routers.training_page_router import training_page_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(main_page_router)
app.include_router(training_page_router)



if __name__ == "__main__":
    uvicorn.run(app=app, host="localhost", port=5000)
    