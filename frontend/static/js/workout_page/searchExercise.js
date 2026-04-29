import { API_URL } from "../config.js";
import { apiFetch } from "../auth/apiFetch.js"

export async function searchExercise(query) {
    if (!query.trim()) return [];

    const res = await apiFetch(`${API_URL}/exercises?query=${encodeURIComponent(query)}`);

    if (!res.ok) return [];

    const data = await res.json();

    if (data.message) return [];

    return data;
}