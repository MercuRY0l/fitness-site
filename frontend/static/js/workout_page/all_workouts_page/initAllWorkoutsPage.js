
import { renderWorkout } from "./renderWorkouts.js";
import { loadWorkouts } from "./renderWorkouts.js";

export async function initAllWorkoutsPage(){

    const workouts = await loadWorkouts();
    if (!workouts){
        console.log("Нет тренировок");
        return;
    }

    await renderWorkout(workouts);

}