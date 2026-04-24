
import { API_URL } from "../config.js";
import { initExerciseUI } from "./exerciseUI.js";
import { loadExercises } from "./loadExercises.js"
import { deleteWorkout } from "./deleteWorkout.js"
import { showToast } from "../showToast.js";

export async function loadLastWorkout(){
    try{
        const response = await fetch(`${API_URL}/workouts/last`, {method : "GET"})
        
        if (!response.ok){
            const err = await response.json();
            console.log(err);
        }

        const data = await response.json();
        return data;
    }
    catch(error){
        console.log(error);
    }

}

export async function renderLastWorkout(workout){

    if (!workout){
        console.log("Ошибка: нет тренировки");
        return;
    }

    const container = document.getElementById("workouts-container")

    container.innerHTML = "";
    
    const workoutDiv = document.createElement("div")

    workoutDiv.classList.add("workout-block")

    let exercises = workout.exercises;
    
    if (!exercises || exercises.length === 0) {
        exercises = await loadExercises(workout.id);
    }

    const exercisesHTML = exercises.map(ex => `
        <div class="exercise-card" data-id="${ex.id}">
            <img class="exercise-img" src="${ex.image}">
            
            <div class="exercise-info">
                <div class="exercise-title">${ex.title}</div>
                <div class="exercise-meta">
                    <span>${ex.sets} подходов</span>
                    <span>${ex.reps} повторений</span>
                </div>
            </div>

            <button class="delete-exercise">✕</button>
        </div>
        `).join("");

        workoutDiv.innerHTML = `
            <div class="workout-header">
                <div>
                    <h3>${workout.title}</h3>
                    <p>${new Date(workout.date).toLocaleDateString()}</p>
                </div>
                <div class="workout-header-actions">
                    <button class="toggle-btn">›</button>
                    <button class="delete-btn">✖</button>
                </div>
            </div>

            <div class="workout-body">
                <div class="exercise-list" id="exercise-list">
                    ${exercisesHTML}
                </div>
                <button class="open-add-exercise" data-id="${workout.id}">+ Добавить упражнение</button>
                <div class="search-container">
                    <input class="exercise-input" placeholder="Введите название упражнения например: жим лежа">
                </div>
            </div>
        `;

        const toggleBtn = workoutDiv.querySelector(".toggle-btn")
        const body = workoutDiv.querySelector(".workout-body");

        toggleBtn.addEventListener("click", () => {
            body.classList.toggle("open");
        });

        container.appendChild(workoutDiv);

        const openBtn = workoutDiv.querySelector(".open-add-exercise");
        const searchContainer = workoutDiv.querySelector(".search-container");
        const input = workoutDiv.querySelector(".exercise-input");

        
        workoutDiv.addEventListener("click", (e) => {
            if (e.target.closest(".open-add-exercise")) {
                const searchContainer = workoutDiv.querySelector(".search-container");
                searchContainer.classList.toggle("open");
            }
        });


            initExerciseUI({
            root: workoutDiv,
            workoutId: workout.id
        });

        const delete_workout_btn = workoutDiv.querySelector(".delete-btn");
        delete_workout_btn.addEventListener("click", async() =>{
            let status = await deleteWorkout(workout.id)
            
            if (!status){
                console.log("Ошибка при удалении тренировки.");
                return;
            }

            workoutDiv.remove()
        })
}


