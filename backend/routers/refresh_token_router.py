
from fastapi import APIRouter, HTTPException, Cookie, Response
from ..jwt import update_token

refresh_token_router = APIRouter()

@refresh_token_router.post("/auth/refresh")
async def refresh(refresh_token : str = Cookie(None), response : Response = Response()):    
    
    if refresh_token is None:
        raise HTTPException(status_code=401, detail={"error" : "Refresh токен не найден."})
    
    access_token = update_token(refresh_token)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )
    
    return {"message" : "refreshed"}
    
     