import { checkAuth } from "../checkAuth.js";
import { API_URL } from "../config.js";
import { apiFetch } from "../auth/apiFetch.js";

export async function initUserPanel() {
    const loginBtn = document.getElementById("open-modal-user-btn");
    const userPanel = document.getElementById("user-panel");

    if (!loginBtn || !userPanel) return;

    const user = await checkAuth();

    
    if (!user) {
        loginBtn.style.display = "block";
        userPanel.innerHTML = "";
        return;
    }

    loginBtn.style.display = "none";

    userPanel.innerHTML = `
        <div class="user-menu-wrapper">
            <span class="user-name">${user.username}</span>

            <div class="user-dropdown">
                <a href="/user/profile">Мой профиль</a>
                <a href="/user/settings">Настройки</a>
                <a href="/user/weight">Статистика</a>
                <a href="#" id="logout-btn">Выйти</a>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById("logout-btn");

    logoutBtn?.addEventListener("click", async (e) => {
        e.preventDefault();

        await apiFetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        window.location.reload();
    });
}