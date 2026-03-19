import { showToast } from "./showToast.js";


export function register(){

    const reg_btn = document.querySelector(".reg-btn")

    if (!reg_btn) return;

    const login_input = document.getElementById("login-input")
    const email_input = document.getElementById("email-input")
    const password_input = document.getElementById("password-input")
    const password_repeat_input = document.getElementById("password-repeat-input")


    if (login_input.value.length < 6){
        showToast("Длинна логина должна быть больше 6 символов!", "error")
    }

    if (password_input.value != password_repeat_input.value){
        showToast("Пароли не совпадают!", "error")
    }

    reg_btn.onclick = async () =>{

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

        if (!response.ok){
            showToast("Что-то пошло не так", "error")
            return;
        }

        showToast("Регистрация прошла успешно", "success")
    }


}