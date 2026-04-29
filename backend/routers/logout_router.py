


from fastapi import APIRouter, HTTPException, Response, Cookie


logout_router = APIRouter()

@logout_router.post("/auth/logout")
async def logout(response : Response, refresh_token : str = Cookie(None)):
    
    if not refresh_token:
        raise HTTPException(status_code=400, detail={"error" : "Refresh токен не найден"})
    
    response.delete_cookie("refresh_token", path="/", samesite="lax")
    response.delete_cookie("access_token", path="/", samesite="lax")
    
    return {"message" : "Успешный выход"}