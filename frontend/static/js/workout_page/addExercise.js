import { API_URL } from "../config.js";
import { apiFetch } from "../auth/apiFetch.js";

export async function addToWorkout(workout_id, exercise_id, sets, reps) {

    try {
        const response = await apiFetch(`${API_URL}/exercises/add-to-workout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                workout_id,
                exercise_id,
                sets,
                reps
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.log(err);
            return;
        }

        console.log("Упражнение добавлено");

    } catch (error) {
        console.log(error);
    }
}