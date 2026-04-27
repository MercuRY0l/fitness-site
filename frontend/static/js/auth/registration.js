import { showToast } from "../showToast.js";


export function register(){

    const reg_btn = document.querySelector(".reg-btn")

    const reg_modal = document.getElementById("modal-register")
    const login_modal = document.getElementById("modal-login")

    if (!reg_btn) return;

    const login_input = document.getElementById("reg-login-input")
    const email_input = document.getElementById("reg-email-input")
    const password_input = document.getElementById("reg-password-input")
    const password_repeat_input = document.getElementById("reg-password-repeat-input")

    reg_btn.onclick = async () =>{


        if (login_input.value.length < 6){
            showToast("Длинна логина должна быть больше 5 символов!", "error")
            return;
        }

        if (password_input.value != password_repeat_input.value){
            showToast("Пароли не совпадают!", "error")
            return;
        }

        if (password_input.value.length < 6){
            showToast("Длинна пароля должна быть больше 5 символов!", "error")
            return;
        }

        if (password_input.value.length > 255){
            showToast("Длинна пароля должна быть меньше 255 символов!", "error")
            return;
        }

        const response = await fetch("http://127.0.0.1:5000/auth/register", {
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
        console.log(data);

        if (!response.ok){
            const ErrorMessage = data?.detail?.error || "Произошла ошибка при регистрации"
            showToast(ErrorMessage, "error")
            return;
        }

        showToast("Регистрация прошла успешно", "success")
        
        reg_modal.classList.remove("active")
        login_modal.classList.add("active")
    }


}