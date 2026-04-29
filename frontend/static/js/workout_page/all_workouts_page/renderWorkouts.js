import { API_URL } from "../../config.js";
import { initExerciseUI } from "../exerciseUI.js";
import { deleteWorkout } from "../deleteWorkout.js";
import { apiFetch } from "../../auth/apiFetch.js";

export function renderWorkout(workout) {

    if (!workout) return;

    const container = document.getElementById("workouts-container");
    if (!container) {
        console.error("Контейнер не найден");
        return;
    }

    const workoutDiv = document.createElement("div");
    workoutDiv.classList.add("workout-block");

    const exercises = workout.exercises ?? [];

    const exercisesHTML = exercises.map(ex => `
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
                <button class="delete-btn" data-id="${workout.workout_id}">✖</button>
            </div>
        </div>

        <div class="workout-body">
            <div class="exercise-list">
                ${exercisesHTML}
            </div>
            <button class="open-add-exercise" data-id="${workout.workout_id}">
                + Добавить упражнение
            </button>
            <div class="search-container" style="display:none;">
                <input class="exercise-input" placeholder="Введите название упражнения например: жим лежа">
            </div>
        </div>
    `;

    const toggleBtn = workoutDiv.querySelector(".toggle-btn");
    const body = workoutDiv.querySelector(".workout-body");

    toggleBtn.addEventListener("click", () => {
        body.classList.toggle("open");
    });

    const openBtn = workoutDiv.querySelector(".open-add-exercise");
    const searchContainer = workoutDiv.querySelector(".search-container");

    openBtn.addEventListener("click", () => {
        searchContainer.style.display = "block";
    });

    container.appendChild(workoutDiv);

    initExerciseUI({
        root: workoutDiv,
        workoutId: workout.workout_id
    });

}


export async function loadWorkouts() {
    try {
        const response = await apiFetch(`${API_URL}/workouts/all`);

        if (!response.ok) {
            const err = await response.json();
            console.log(err);
            return;
        }

        const workouts = await response.json();

        const container = document.getElementById("workouts-container");
        if (!container) {
            console.error("Контейнер не найден");
            return;
        }

        if (!workouts || workouts.length === 0) {
            container.innerHTML = `
                <div class="no-workouts-container">
                    <p>Нет тренировок</p>
                </div>
            `;
            return;
        }

        container.innerHTML = "";

        workouts.forEach(w => renderWorkout(w));
                

    } catch (error) {
        console.log(error);
    }
}