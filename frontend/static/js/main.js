import { initAuthModals } from "./initAuthModals.js"
import { register } from "./registration.js";
import { login } from "./login.js";
import { protectLink } from "./protectLink.js";


document.addEventListener("DOMContentLoaded", async () => {
    initAuthModals();
    register();
    login();
    protectLink("to_train_page");
    
});