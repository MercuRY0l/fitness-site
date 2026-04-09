import { showToast } from "./showToast.js"
import { checkAuth } from "./checkAuth.js";

let currentWorkoutId = null;
let searchInitialized = false;
let addExerciseInitialized = false;

export async function createWorkout() {
    const user_id = await checkAuth();

    if (!user_id){
        showToast("Не авторизован", "error")
        return;
    }

    const exerciseContainer = document.getElementById("exerciseContainer")
    const workoutContainer = document.querySelector(".training-form")

    const workout_title = document.getElementById("workout-title").value
    const workout_date = document.getElementById("workout-date").value

    if (!workout_title.trim()){
        showToast("Необходимо заполнить название", "error")
        return;
    }

    if(!workout_date){
        showToast("Необходимо выбрать дату тренировки", "error")
        return; 
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/workouts/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: Number(user_id),
                title: workout_title,
                workout_date: workout_date
            })
        })

        if (!response.ok) {
            const errorText = await response.text()

            try {
                const errorData = JSON.parse(errorText)
                const message = errorData.detail?.map(e => e.msg).join(", ")
                showToast(message, "error")
            } catch {
                showToast("Ошибка сервера", "error")
            }
            return
        }

        const data = await response.json()
        currentWorkoutId = data.id

        workoutContainer.classList.add("hidden");
        exerciseContainer.classList.add("show");

       
        initSearch();
        initAddExercise();

        showToast("Тренировка успешно создана", "success");

    } catch (error) {
        console.log("CATCH ERROR:", error)
        showToast("Ошибка сети", "error")
    }
}


function RenderExercise(list_exercise) {
    const res = document.getElementById("search-results")
    if (!res) return; 

    res.innerHTML = ""

    list_exercise.forEach(ex => {
        const div = document.createElement("div")
        div.classList.add("exercise-card")

        div.innerHTML = `
            <h3>${ex.exercise_title}</h3>
            <p>${ex.exercise_description}</p>
            <img src="${ex.exercise_image}" alt="${ex.exercise_title}">
            <button 
                class="add-btn add-exercise-btn"
                data-id="${ex.exercise_id}"
            >
                Выбрать упражнение
            </button>
        `

        res.appendChild(div)
    })
}


function debounce(fn, delay = 300) {
    let timeout;

    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}


function initSearch() {
    if (searchInitialized) return; 
    searchInitialized = true;

    const search_input = document.getElementById("searchInput")
    const search_results = document.getElementById("search-results")

    if (!search_input || !search_results) {
        console.error("Элементы поиска не найдены")
        return
    }

    search_input.addEventListener("input", debounce(async () => {
        const query = search_input.value.trim()

        
        if (!query || query.length < 2) {
            search_results.innerHTML = ""
            search_results.classList.remove("show")
            return
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/exercises?query=${encodeURIComponent(query)}`
            )

           
            if (!response.ok) {
                search_results.innerHTML = ""
                search_results.classList.remove("show")
                return
            }

            const data = await response.json()

            if (!Array.isArray(data) || data.length === 0) {
                search_results.innerHTML = ""
                search_results.classList.remove("show")
                return
            }

            search_results.classList.add("show")
            RenderExercise(data)

        } catch (error) {
            console.log(error)
            search_results.innerHTML = ""
            search_results.classList.remove("show")
        }

    }, 300))


    search_input.addEventListener("focus", () => {
        if (search_input.value.trim()) {
            search_results.classList.add("show")
        }
    })


    document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-container")) {
            search_results.classList.remove("show")
        }
    })
}



function initAddExercise() {
    if (addExerciseInitialized) return;
    addExerciseInitialized = true;

    const search_results = document.getElementById("search-results")
    if (!search_results) return;

    search_results.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("add-exercise-btn")) return
        
        if (!currentWorkoutId) {
            showToast("Сначала создайте тренировку", "error")
            return
        }

        const sets = document.getElementById("workout-sets").value
        const reps = document.getElementById("workout-reps").value

        if (!sets || !reps) {
            showToast("Укажите подходы и повторения", "error")
            return
        }

        const exerciseId = e.target.dataset.id

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/exercises/add-to-workout",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        workout_id: currentWorkoutId,
                        exercise_id: Number(exerciseId),
                        sets: sets,
                        reps: reps
                    })
                }
            )

            const data = await response.json()

            if (!response.ok) {
                showToast(data.detail || "Ошибка добавления", "error")
                return
            }

            showToast("Упражнение добавлено", "success")

            e.target.textContent = "Добавлено"
            e.target.disabled = true

        } catch (error) {
            console.log(error)
            showToast("Ошибка сети", "error")
        }
    })
}