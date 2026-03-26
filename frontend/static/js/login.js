

import { showToast } from "./showToast.js";


export function login(){

    const login_btn = document.querySelector(".log-btn")
    const log_modal = document.getElementById("modal-login")

    const login_input = document.getElementById("login-input-login")
    const password_input = document.getElementById("login-input-password")

    login_btn.onclick = async () => {
        
        const response = await fetch("http://127.0.0.1:5000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "login" : login_input.value,
                    "password" : password_input.value
                }),
                credentials: "include"
            }

        )

        if (!response.ok) {
                const error = await response.json();
                const errorMessage = error.detail?.error || "Произошла ошибка при авторизации"
                showToast(errorMessage, "error");
                return;
            }
        showToast("Вы успешно вошли!", "success")
        log_modal.classList.remove("active")

    }


}
