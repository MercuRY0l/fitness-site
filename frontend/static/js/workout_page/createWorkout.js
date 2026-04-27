
import {showToast} from "../showToast.js"
import { API_URL } from "../config.js"
import {renderLastWorkout, loadLastWorkout} from "./loadLastWorkout.js"
import {apiFetch} from "../auth/apiFetch.js"


const workout_title_input = document.getElementById("workout-title")
const workout_date_input = document.getElementById("workout-date")
const title_error = document.getElementById("title-error")
const date_error = document.getElementById("date-error")

function validateTitle(){
    
    const value = workout_title_input.value.trim();

    if(!value){
        workout_title_input.classList.add("error");
        title_error.textContent = "Введите название тренировки!"
        title_error.classList.add("active")
        return false;
    }

    workout_title_input.classList.remove("error");
    title_error.textContent = "";
    title_error.classList.remove("active");

    return true;

}

function validateDate(){
    const value = workout_date_input.value.trim();
    const today = new Date().toISOString().split("T")[0];

    if(!value){
        workout_date_input.classList.add("error");
        date_error.textContent = "Введите дату тренировки!"
        date_error.classList.add("active")
        return false;
    }

    if (value < today){
        workout_date_input.classList.add("error");
        date_error.textContent = `Дата не может быть в прошлом - сегодня ${today})`
        date_error.classList.add("active")
        return false;
    }

    workout_date_input.classList.remove("error");
    date_error.textContent = "";
    date_error.classList.remove("error")

    return true;
}


export async function createWorkout(){

    const isTitleValid = validateTitle();
    const isDateValid = validateDate();

    if (!isTitleValid || !isDateValid) return false;

    const title = workout_title_input.value.trim();
    const date = workout_date_input.value;

    try {
        const response = await apiFetch(`${API_URL}/workouts/create`, {   
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, date })
        });

        const data = await response.json(); 

        if (!response.ok){
            console.log("Ошибка:", data);
            showToast("Ошибка при создании тренировки", "error");
            return false;
        }

        showToast("Тренировка успешно создана!");

        workout_title_input.value = "";
        workout_date_input.value = "";

        return true;

    } catch(error){
        console.log(error);
        showToast("Ошибка сети", "error");
        return false;
    }
}