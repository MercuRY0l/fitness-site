
import { API_URL } from "../config.js";

export async function deleteExerciseFromWorkout(workout_id, exercise_id) {
    try {
        const res = await fetch(
            `${API_URL}/workouts/${workout_id}/exercises/${exercise_id}`,
            {
                method: "DELETE"
            }
        );

        if (!res.ok) { 
            const err = await res.json();
            console.log(err);
        }

    } catch (e) {
        console.log(e);
    }
}