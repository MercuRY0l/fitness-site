
import { API_URL } from "../../config.js"
import { apiFetch } from "../../auth/apiFetch.js"

export async function loadWeight(){
    try{
        const response = await apiFetch(`${API_URL}/user/weight/get`, {
            method : "GET"
        })
        const data = await response.json().catch(()=>null);

        if (!response.ok) {
            console.error("Ошибка при получении данных:", data);
            return false;
        }

        return data;
    }
    catch(error){
        console.error(error);
    }
}