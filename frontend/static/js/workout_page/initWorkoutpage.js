



import { createWorkout } from "./createWorkout.js";
import { renderLastWorkout } from "./loadLastWorkout.js";
import { loadLastWorkout } from "./loadLastWorkout.js";

export async function initWorkoutPage(){
    
    const workout = await loadLastWorkout();
    await renderLastWorkout(workout);
    
    const create_btn = document.getElementById("createWorkout");
    if (create_btn) {
        create_btn.addEventListener("click", async () => {
            await createWorkout();

            const newWorkout = await loadLastWorkout();
            await renderLastWorkout(newWorkout);
        });
    }



    
}