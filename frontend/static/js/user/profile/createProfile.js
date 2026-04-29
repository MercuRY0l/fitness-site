import { apiFetch } from "../../auth/apiFetch.js";
import { API_URL } from "../../config.js";

export async function createProfile(params) {
    try {
        const response = await apiFetch(`${API_URL}/user/profile/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params)
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            console.error("Error:", data);
            return null;
        }

        return data;

    } catch (error) {
        console.error(error);
        return null;
    }
}