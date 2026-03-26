import { initAuthModals } from "./initAuthModals.js"
import { register } from "./registration.js";
import { login } from "./login.js";

document.addEventListener("DOMContentLoaded", () => {
    initAuthModals();
    register();
    login();
});