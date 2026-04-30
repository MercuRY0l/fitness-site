import { createWeight } from "./createWeight.js";
import { loadWeight } from "./loadWeight.js";
import { deleteWeight } from "./deleteWeight.js";

let chart = null;
let isInit = false;
let isLoading = false;
let isDeleting = false;

export async function initWeightTracker() {
    if (isInit) return;
    isInit = true;

    const input = document.getElementById("weight-input");
    const addBtn = document.getElementById("add-weight-btn");
    const deleteBtn = document.getElementById("delete-weight-btn");

    if (!input || !addBtn || !deleteBtn) return;

    
    addBtn.addEventListener("click", async () => {
        if (isLoading) return;

        const weight = Number(input.value.trim());
        if (isNaN(weight)) return;

        isLoading = true;
        addBtn.disabled = true;

        try {
            const result = await createWeight({ weight });
            if (!result) return;

            input.value = "";
            await renderWeightChart();

        } finally {
            isLoading = false;
            addBtn.disabled = false;
        }
    });

    
    deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        if (isDeleting) return;
        isDeleting = true;

        deleteBtn.disabled = true;

        try {
            const result = await deleteWeight();
            if (!result) return;

            destroyChart();
            clearStats();

            const canvas = document.getElementById("weightChart");
            if (canvas) {
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            await renderWeightChart();

        } finally {
            isDeleting = false;
            deleteBtn.disabled = false;
        }
    });

    await renderWeightChart();
}

async function renderWeightChart() {
    const data = await loadWeight();

    
    if (!data || data.length === 0) {
        clearStats();
        destroyChart();
        return;
    }

    const labels = data.map(i => new Date(i.date));
    const weights = data.map(i => Number(i.weight));

    updateStats(weights);

    const canvas = document.getElementById("weightChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    destroyChart();

    const last = weights.at(-1);
    const first = weights[0];

    const isUp = last >= first;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, isUp ? "rgba(34,197,94,0.3)" : "rgba(255,60,60,0.3)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    chart = new Chart(canvas, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Вес",
                    data: weights,
                    borderColor: isUp ? "#22c55e" : "#ff3c3c",
                    backgroundColor: gradient,
                    borderWidth: 4,
                    fill: true,
                    tension: 0.25,

                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 2
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            animation: {
                duration: 600
            },

            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: "index",
                    intersect: false
                }
            },

            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "day"
                    },
                    grid: {
                        display: false
                    }
                },

                y: {
                    min: Math.min(...weights) - 1,
                    max: Math.max(...weights) + 1,


                    grid: {
                        color: "rgba(255,255,255,0.05)"
                    },
                    ticks: {
                        color: "#aaa"
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

function updateStats(weights) {
    const current = weights.at(-1);
    const first = weights[0];

    document.getElementById("current-weight").textContent =
        `Текущий вес: ${current} кг`;

    const diff = (current - first).toFixed(1);

    document.getElementById("month-diff").textContent =
        `Изменение: ${diff} кг`;
}

function clearStats() {
    document.getElementById("current-weight").textContent = "";
    document.getElementById("month-diff").textContent = "";
}

function destroyChart() {
    if (chart) {
        chart.destroy();
        chart = null;
    }
}