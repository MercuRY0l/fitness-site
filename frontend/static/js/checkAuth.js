import { showToast } from "./showToast.js";
import { API_URL } from "./config.js";
import { apiFetch } from "./auth/apiFetch.js";

export async function checkAuth() {
    try {
        const response = await apiFetch(`${API_URL}/auth/me`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (!data.user || !data.user.id) {
            return null;
        }

        return data.user; 

    } catch (error) {
        console.log(error);
        showToast("Ошибка сети", "error");
        return null;
    }
}