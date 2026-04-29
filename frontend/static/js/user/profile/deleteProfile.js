import { apiFetch } from "../../auth/apiFetch.js";
import { API_URL } from "../../config.js";

export async function deleteProfile() {
    try {
        const response = await apiFetch(`${API_URL}/user/profile/delete`, {
            method: "DELETE"
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            console.error("Delete error:", data);
            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        return false;
    }
}