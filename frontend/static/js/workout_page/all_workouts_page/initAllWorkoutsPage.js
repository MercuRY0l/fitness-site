
import { loadWorkouts } from "./renderWorkouts.js";
import { deleteWorkout } from "../deleteWorkout.js";

export async function initAllWorkoutsPage(){
    await loadWorkouts();


    const container = document.getElementById("workouts-container");

    container.addEventListener("click", async (e) => {

        const btn = e.target.closest(".delete-btn");
        if (!btn) return;

        const id = btn.dataset.id;

        if (!id) {
            console.error("ID не найден");
            return;
        }

        const success = await deleteWorkout(id);
        
        if (!success){
            return;
        }

        btn.closest(".workout-block").remove();
    });
} 