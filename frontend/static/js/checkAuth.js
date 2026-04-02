
import {showToast} from "./showToast.js"

export async function checkAuth(){

    const response = await fetch("http://127.0.0.1:5000/auth/me", {
        method : "GET",
        credentials : "include"
    });
    
    if (!response.ok){
        showToast("Необходимо авторизоваться!", "error")
        return false;
    }

    return true;

}