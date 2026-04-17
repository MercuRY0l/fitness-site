import { initAuthModals } from "./initAuthModals.js"
import { register } from "./registration.js";
import { login } from "./login.js";
import { initWorkoutPage } from "./workout_page/initWorkoutpage.js";



document.addEventListener("DOMContentLoaded", async () => {
    initAuthModals();
    register();
    login();
    
    await initWorkoutPage();

    
});