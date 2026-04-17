
import { searchExercise } from "./searchExercise.js";
import { addToWorkout } from "./addExercise.js";
import {removeExercise} from "./removeExercise.js"

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

        item.innerHTML = `
            <input type="number" placeholder="Подходы" class="sets">
            <input type="number" placeholder="Повторы" class="reps">
            <button class="save">✔</button>
        `;

        item.querySelector(".save").addEventListener("click", async () => {
            const sets = item.querySelector(".sets").value;
            const reps = item.querySelector(".reps").value;
            const exercise_id = item.dataset.id;

            await addToWorkout(workoutId, exercise_id, sets, reps);

            addExerciseToDOM(item.dataset.id, sets, reps);

            container.innerHTML = "";
            input.value = "";
        });
    }


    function addExerciseToDOM(exercise_id, sets, reps) {

        const div = document.createElement("div");
        div.className = "exercise";
        div.dataset.id = exercise_id;

        div.innerHTML = `
            <b>Упражнение ${exercise_id}</b>
            <span>${sets} x ${reps}</span>
            <button class="delete">Удалить</button>
        `;

        exerciseList.appendChild(div);
    }

    exerciseList.addEventListener("click", async (e) => {
        const btn = e.target.closest(".delete");
        if (!btn) return;

        const item = btn.closest(".exercise");
        const id = item.dataset.id;

        await removeExercise(workoutId, id);

        item.remove();
    });
}