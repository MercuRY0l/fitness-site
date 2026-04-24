
import { searchExercise } from "./searchExercise.js";
import { addToWorkout } from "./addExercise.js";
import { deleteExerciseFromWorkout } from "./deleteExerciseFromWorkout.js"
import {showToast} from "../showToast.js"

export function initExerciseUI({ root, workoutId }) {

    const openBtn = root.querySelector(".open-add-exercise");
    const container = root.querySelector(".search-container");
    const input = root.querySelector(".exercise-input");
    const exerciseList = root.querySelector(".exercise-list");

    let debounce;

    openBtn.addEventListener("click", () => {
        container.style.display = "block";
        input.focus();
    });

    
    input.addEventListener("input", () => {
        clearTimeout(debounce);

        debounce = setTimeout(async () => {
            const exercises = await searchExercise(input.value);
            renderResults(exercises);
        }, 300);
    });


    function renderResults(exercises) {

        container.querySelector(".search-results")?.remove();

        if (!exercises.length) return;

        const list = document.createElement("div");
        list.className = "search-results";

        list.innerHTML = exercises.map(ex => `
            <div class="search-item" data-id="${ex.exercise_id}">
                <img src="${ex.exercise_image}">
                <b>${ex.exercise_title}</b>
                <button class="add-btn">+</button>
            </div>
        `).join("");
        
        list.classList.add("show");

        container.appendChild(list);

        list.addEventListener("click", (e) => {
            const btn = e.target.closest(".add-btn");
            if (!btn) return;

            const item = btn.closest(".search-item");
            showForm(item);
        });
    }

    function showForm(item) {

        const exercise_id = item.dataset.id ?? item.dataset.exercise_id;
        const title = item.querySelector("b").textContent;
        const image = item.querySelector("img").src;

        const form = document.createElement("div");
        form.className = "exercise-form";

        form.innerHTML = `
            <input type="number" min="1" placeholder="Подходы" class="sets">
            <input type="number" min="1" placeholder="Повторы" class="reps">
            <button class="save">✔</button>
        `;

    
        item.innerHTML = "";
        item.appendChild(form);

        form.querySelector(".save").addEventListener("click", async () => {

            const sets = parseInt(form.querySelector(".sets").value);
            const reps = parseInt(form.querySelector(".reps").value);

            if (!sets || !reps || sets <= 0 || reps <= 0) {
                showToast("Введите корректные значения", "error");
                return;
            }

            await addToWorkout(workoutId, exercise_id, sets, reps);

            addExerciseToDOM({
                id: exercise_id,
                title,
                image,
                sets,
                reps
            });

            resetSearch();
        });
    }

    function resetSearch() {
        container.querySelector(".search-results")?.remove();
        input.value = "";
        container.style.display = "none";
    }   

    function addExerciseToDOM(exercise) {

        const div = document.createElement("div");
        div.className = "exercise-card";
        div.dataset.id = exercise.id ?? exercise.exercise_id;

        div.innerHTML = `
            <img class="exercise-img" src="${exercise.image}">
            
            <div class="exercise-info">
                <div class="exercise-title">${exercise.title}</div>
                <div class="exercise-meta">
                    <span>${exercise.sets} подходов</span>
                    <span>${exercise.reps} повторений</span>
                </div>
            </div>

            <button class="delete-exercise">✕</button>
        `;

        exerciseList.appendChild(div);
    }


    exerciseList.addEventListener("click", async (e) => {
        const btn = e.target.closest(".delete-exercise");
        if (!btn) return;

        const item = btn.closest(".exercise-card");
        const id = item.dataset.id;

        await deleteExerciseFromWorkout(workoutId, id);

        item.remove();
    });
}