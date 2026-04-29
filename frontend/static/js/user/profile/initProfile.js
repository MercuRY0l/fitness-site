import { API_URL } from "../../config.js";
import { apiFetch } from "../../auth/apiFetch.js";

import { createProfile } from "./createProfile.js";
import { updateProfile } from "./updateProfile.js";
import { deleteProfile } from "./deleteProfile.js";

export async function initProfile() {

    const profileCard = document.getElementById("profile-card");
    if (!profileCard) return;

    const form = profileCard.querySelector(".profile-form");
    if (!form) return;

    const inputs = form.querySelectorAll("input, select");

    let profile = null;

    
    try {
        const res = await apiFetch(`${API_URL}/user/profile/me`);

        if (res.ok) {
            profile = await res.json();
            fillForm(profile);
        }
    } catch (err) {
        console.error("Load profile error:", err);
    }

    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = getFormData(inputs);

        try {
            if (profile) {
                await updateProfile(data);
            } else {
                profile = await createProfile(data);
            }
        } catch (err) {
            console.error("Save error:", err);
        }
    });

    
    const actionsWrapper = document.createElement("div");
    actionsWrapper.className = "form-actions";

    const saveBtn = form.querySelector(".save-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "✖";

    actionsWrapper.appendChild(saveBtn);
    actionsWrapper.appendChild(deleteBtn);

    form.appendChild(actionsWrapper);

    deleteBtn.addEventListener("click", async () => {
        try {
            await deleteProfile();
            clearForm(inputs);
            profile = null;
        } catch (err) {
            console.error("Delete error:", err);
        }
    });


    function fillForm(profile) {
        inputs.forEach(input => {
            if (!input.name) return;

            if (profile[input.name] !== undefined) {
                input.value = profile[input.name];
            }
        });
    }

    function clearForm(inputs) {
        inputs.forEach(input => {
            if (input.tagName === "SELECT") {
                input.selectedIndex = 0;
            } else {
                input.value = "";
            }
        });
    }

    function getFormData(inputs) {
        const data = {};

        inputs.forEach(input => {
            if (!input.name) return;
            data[input.name] = input.value;
        });

        return data;
    }
}