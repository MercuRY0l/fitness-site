import { showToast } from "./showToast.js";


export function register(){

    const reg_btn = document.querySelector(".reg-btn")
    const modal = document.querySelector(".modal")

    if (!reg_btn) return;

    const login_input = document.getElementById("login-input")
    const email_input = document.getElementById("email-input")
    const password_input = document.getElementById("password-input")
    const password_repeat_input = document.getElementById("password-repeat-input")

    reg_btn.onclick = async () =>{


        if (login_input.value.length < 6){
        showToast("Длинна логина должна быть больше 5 символов!", "error")
        }

        if (password_input.value != password_repeat_input.value){
            showToast("Пароли не совпадают!", "error")
        }

        if (password_input.value.length < 6){
            showToast("Длинна пароля должна быть больше 5 символов!", "error")
        }

        if (password_input.value.length > 255){
            showToast("Длинна пароля должна быть меньше 255 символов!", "error")
        }

        const response = await fetch("http://localhost:5000/auth/register", {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({
                "login" : login_input.value,
                "email" : email_input.value,
                "password" : password_input.value,
                "password_repeat" : password_repeat_input.value
            })
            
        })

        const data = await response.json()

        if (!response.ok){
            const ErrorMessage = data?.detail?.error || "Произошла ошибка при регистрации"
            showToast(ErrorMessage, "error")
            return;
        }

        showToast("Регистрация прошла успешно", "success")
        
        modal.style.display = "none"
    }


}