import { showToast } from "./showToast.js";

export async function checkAuth() {
    try {
        const response = await fetch("http://127.0.0.1:5000/auth/me", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            showToast("Необходимо авторизоваться!", "error");
            return null;
        }

        const data = await response.json();

    
        if (!data.user || !data.user.id) {
            showToast("Не удалось получить ID пользователя", "error");
            return null;
        }

        return data.user.id; 

    } catch (error) {
        console.log(error);
        showToast("Ошибка сети", "error");
        return null;
    }
}