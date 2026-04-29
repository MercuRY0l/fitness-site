
import {checkAuth} from "./checkAuth.js"
import { showToast } from "./showToast.js"


export function protectLink(linkId, redirectTo = "/auth/login") {
    const link = document.getElementById(linkId);

    if (!link) return;

    link.addEventListener("click", async (e) => {
        e.preventDefault(); 

        const isAuth = await checkAuth();

        if (isAuth) {
            window.location.href = link.getAttribute("href");
        } else {
            showToast("Необходимо авторизоваться", "error");
            window.location.href = redirectTo;
        }
    });
}