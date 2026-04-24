import { API_URL } from "../config.js";


export async function loadExercises(workoutId) {
    const res = await fetch(`${API_URL}/workouts/${workoutId}/exercises`);
    if (!res.ok) return [];
    return await res.json();
}