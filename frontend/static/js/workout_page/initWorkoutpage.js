



import { createWorkout } from "./createWorkout.js";
import { renderLastWorkout } from "./loadLastWorkout.js";
import { loadLastWorkout } from "./loadLastWorkout.js";

export async function initWorkoutPage(){
    
    const workout = await loadLastWorkout();
    
    if (workout){
        await renderLastWorkout(workout);
    }
    
    const create_btn = document.getElementById("createWorkout");
    if (create_btn) {
        create_btn.addEventListener("click", async () => {
            const created = await createWorkout();

            if(!created){
                return;
            }

            const newWorkout = await loadLastWorkout();

            if (newWorkout) {
                await renderLastWorkout(newWorkout);
            }

        });
    }
    
}