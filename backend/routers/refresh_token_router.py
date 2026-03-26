
from fastapi import APIRouter, HTTPException, Cookie
from ..jwt import update_token

refresh_token_router = APIRouter()

@refresh_token_router.post("/auth/refresh")
async def refresh(refresh_token : str = Cookie(None)):
    
    if refresh_token is None:
        raise HTTPException(status_code=400, detail={"error" : "Refresh токен не найден."})
    
    access_token = update_token(refresh_token)
    
    return {"access_token" : access_token, "token_type" : "bearer"}
    
    