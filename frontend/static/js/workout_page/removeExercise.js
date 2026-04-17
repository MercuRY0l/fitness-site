
import { API_URL } from "../config.js";

export async function removeExercise(workout_id, exercise_id) {
    try {
        const res = await fetch(
            `${API_URL}/remove-exercise?workout_id=${workout_id}&exercise_id=${exercise_id}`,
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