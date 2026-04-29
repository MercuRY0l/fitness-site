import { apiFetch } from "../../auth/apiFetch.js";
import { API_URL } from "../../config.js";

export async function updateProfile(params) {
    try {
        const response = await apiFetch(`${API_URL}/user/profile/update`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params)
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            console.error("Update error:", data);
            return null;
        }

        return data;

    } catch (error) {
        console.error(error);
        return null;
    }
}