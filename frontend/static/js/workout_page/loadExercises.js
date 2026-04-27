import { API_URL } from "../config.js";
import { apiFetch } from "../auth/apiFetch.js";


export async function loadExercises(workoutId) {
    const res = await apiFetch(`${API_URL}/workouts/${workoutId}/exercises`);
    if (!res.ok) return [];
    return await res.json();
}