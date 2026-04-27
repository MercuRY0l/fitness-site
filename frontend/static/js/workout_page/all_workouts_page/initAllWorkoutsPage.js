
import { loadWorkouts } from "./renderWorkouts.js";

export async function initAllWorkoutsPage(){
    await loadWorkouts();
} 