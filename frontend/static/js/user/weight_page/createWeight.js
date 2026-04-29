
import { API_URL } from "../../config.js"
import { apiFetch } from "../../auth/apiFetch.js"

export async function createWeight(weight){
    try{
        const response = await apiFetch(`${API_URL}/user/weight/create`, {
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(weight)
        })
        
        if (!response.ok){
            console.error("Ошибка при выполнении запроса");
            return;
        }

        const data = await response.json();
        return data;

    }

    catch(error){
        console.error(error);
    }
}