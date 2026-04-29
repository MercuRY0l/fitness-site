
import { API_URL } from "../../config.js"
import { apiFetch } from "../../auth/apiFetch.js"

export async function deleteWeight(){
    try{
        const response = await apiFetch(`${API_URL}/user/weight/delete`, {
            method : "DELETE"
        })

        if (!response.ok) {
            const data = await response.json();
            console.error("Ошибка при удалении:", data);
            return false;
        }
    }
    catch(error){
        console.error(error);
    }
}