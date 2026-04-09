import { initAuthModals } from "./initAuthModals.js"
import { register } from "./registration.js";
import { login } from "./login.js";
import { createWorkout } from "./initWorkoutPage.js";


document.addEventListener("DOMContentLoaded", async () => {
    initAuthModals();

    register();
    login();
    

    const create_btn = document.getElementById("createWorkout");
    if (create_btn) {
        create_btn.addEventListener("click", async () => {
            await createWorkout();
        });
    }
});