
import { API_URL } from "../../config.js";
import {initExerciseUI} from "../exerciseUI.js"

export function renderWorkout(workout) {

    if (!workout){
        return;
    }

    const container = document.getElementById("workouts-container");

    const workoutDiv = document.createElement("div");
    workoutDiv.classList.add("workout-block");

    const exercises = workout.exercises ?? [];

    const exercisesHTML = workout.exercises.map(ex => `
        <div class="exercise">
            <img src="${ex.image}">
            <b>Упражнение: ${ex.title}</b>
            <span>${ex.sets} x ${ex.reps}</span>
            <button>Удалить</button>
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

    
    openBtn.addEventListener("click", () => {
        searchContainer.style.display = "block";
    });


     initExerciseUI({
        root: workoutDiv,
        workoutId: workout.id
    });
}


export async function loadWorkouts() {


    try {
        const response = await fetch(`${API_URL}/workouts/all`);

        if (!response.ok) {
            const err = await response.json();
            console.log(err);
            return;
        }

        const workouts = await response.json();

        const container = document.getElementById("workouts-container");

        if (workouts.length === 0) {
            container.innerHTML = "<h2>Нет тренировок</h2>";
            return;
        }

        
        container.innerHTML = ""; 

        workouts.forEach(w => {
            renderWorkout(w);
        });

    } catch (error) {
        console.log(error);
    }
}