



import { createWorkout } from "./createWorkout.js";
import { loadWorkouts } from "./renderWorkouts.js";


export async function initWorkoutPage(){
    
    await loadWorkouts();

    const create_btn = document.getElementById("createWorkout");
    if (create_btn) {
        create_btn.addEventListener("click", async () => {
            await createWorkout();
        });
    }

    
}