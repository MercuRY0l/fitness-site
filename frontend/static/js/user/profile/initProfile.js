import { API_URL } from "../../config.js";
import { apiFetch } from "../../auth/apiFetch.js";

import { createProfile } from "./createProfile.js";
import { updateProfile } from "./updateProfile.js";
import { deleteProfile } from "./deleteProfile.js";

import {showToast} from "../../showToast.js"

let isInit = false;
let isSaving = false;
let isDeleting = false;

export async function initProfile() {
    if (isInit) return;
    isInit = true;

    const profileCard = document.getElementById("profile-card");
    if (!profileCard) return;

    const form = profileCard.querySelector(".profile-form");
    if (!form) return;

    const inputs = form.querySelectorAll("input, select");
    const saveBtn = form.querySelector(".save-btn");

    if (!saveBtn) return;

    let profile = null;

    const actionsWrapper = document.createElement("div");
    actionsWrapper.className = "form-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✖";

    saveBtn.parentNode?.insertBefore(actionsWrapper, saveBtn);
    actionsWrapper.appendChild(saveBtn);
    actionsWrapper.appendChild(deleteBtn);

    await loadProfile();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (isSaving) return;
        isSaving = true;
        saveBtn.disabled = true;

        try {
            const data = getFormData(inputs);

            if (profile) {
                const updated = await updateProfile(data);

                if (updated !== false) {
                    profile = { ...profile, ...data };
                }
            } else {
                const created = await createProfile(data);

                if (created !== false) {
                    await loadProfile();
                }
            }

            showToast("Сохранено", "success");

        } catch (err) {
            console.error("Save profile error:", err);
        } finally {
            isSaving = false;
            saveBtn.disabled = false;
        }
    });

    deleteBtn.addEventListener("click", async () => {
        if (isDeleting) return;
        if (!profile) return;

        isDeleting = true;
        deleteBtn.disabled = true;

        try {
            const result = await deleteProfile();

            if (result !== false) {
                profile = null;
                clearForm(inputs);
            }
        } catch (err) {
            console.error("Delete profile error:", err);
        } finally {
            isDeleting = false;
            deleteBtn.disabled = false;
        }
    });

    async function loadProfile() {
        try {
            const res = await apiFetch(`${API_URL}/user/profile/me`);

            if (!res.ok) {
                profile = null;
                clearForm(inputs);
                return;
            }

            const data = await res.json();

            if (data) {
                profile = data;
                fillForm(data);
            } else {
                profile = null;
                clearForm(inputs);
            }
        } catch (err) {
            console.error("Load profile error:", err);
            profile = null;
        }
    }

    function fillForm(data) {
        inputs.forEach(input => {
            if (!input.name) return;

            if (data[input.name] !== undefined && data[input.name] !== null) {
                input.value = data[input.name];
            }
        });
    }

    function clearForm(fields) {
        fields.forEach(input => {
            if (input.tagName === "SELECT") {
                input.selectedIndex = 0;
            } else {
                input.value = "";
            }
        });
    }

    function getFormData(fields) {
        const data = {};

        fields.forEach(input => {
            if (!input.name) return;

            data[input.name] =
                input.type === "number" && input.value !== ""
                    ? Number(input.value)
                    : input.value;
        });

        return data;
    }
}