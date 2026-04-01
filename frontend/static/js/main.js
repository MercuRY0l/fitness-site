import { initAuthModals } from "./initAuthModals.js"
import { register } from "./registration.js";
import { login } from "./login.js";
import { checkAuth } from "./checkAuth.js";

document.addEventListener("DOMContentLoaded", async () => {
    initAuthModals();
    register();
    login();
    await checkAuth();
});