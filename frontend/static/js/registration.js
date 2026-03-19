import { showToast } from "./showToast";


export async function register(){

    log_btn = document.querySelector("reg-btn")

    if (!log_btn) return;

    login_input = document.getElementById(".login-input")
    email_input = document.getElementById(".email-input")
    password_input = document.getElementById(".password-input")
    password_repeat_input = document.getElementById(".password-repeat-input")


    if (login_input.length() < 6){
        showToast("Длинна логина должна быть больше 6 символов!", "error")
    }

    if (password_input != password_repeat_input){
        showToast("Пароли не совпадают!", "error")
    }

    const response = await fetch("http://127.0.0.1:5000/register", {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({
            "username" : login_input,
            "email" : email_input,
            "password" : password_input,
            "password_repeat" : password_repeat_input
        })
        
    
    })

    if (!response.ok){
        showToast("Что-то пошло не так", "error")
    }


}