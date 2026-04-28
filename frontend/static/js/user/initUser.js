import { checkAuth } from "../checkAuth.js";
import { API_URL } from "../config.js";
import { apiFetch } from "../auth/apiFetch.js";

export async function initUserPanel() {
    const btn = document.getElementById("open-modal-user-btn");
    if (!btn) return;

    const user = await checkAuth();

    if (!user) {
        btn.innerHTML = `Личный кабинет`;
        return;
    }

    btn.innerHTML = `
        <div class="user-menu-wrapper">
            <span class="user-name">${user.username}</span>
            <div class="user-dropdown">
                <a href="/user/profile">Мой профиль</a>
                <a href="/user/settings">Настройки</a>
                <a href="#" id="logout-btn">Выйти</a>
            </div>
        </div>
    `;

    const logoutBtn = document.getElementById("logout-btn");

    logoutBtn?.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        await apiFetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });

        window.location.reload();
    });
}