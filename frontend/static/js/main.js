import { initAuthModals } from "./initAuthModals.js"
import { register } from "./auth/registration.js";
import { login } from "./auth/login.js"
import { initWorkoutPage } from "./workout_page/initWorkoutpage.js";
import { initAllWorkoutsPage } from "./workout_page/all_workouts_page/initAllWorkoutsPage.js";


document.addEventListener("DOMContentLoaded", async () => {
    initAuthModals();
    register();
    login();
    
    if (document.getElementById("last-workout-container")) {
        await initWorkoutPage();
    }

    if (document.getElementById("workouts-container")) {
        await initAllWorkoutsPage();
    }
    
});