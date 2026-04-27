

import {showToast} from "../showToast.js"

export async function apiFetch(url, options={}) {
    let response = await fetch(url, {
        ...options,
        credentials : "include",
        headers : {"Content-Type" : "application/json",
            ...(options.headers || {}),
        },

    });

    if (response.status === 401){
        const refreshResponse = await fetch("/auth/refresh", {
            method : "POST",
            credentials : "include"
        })

        if (!refreshResponse.ok){
            window.location.href = "/";
            showToast("Необходимо авторизоваться", "error");
            return;
        }

        response = await fetch(url, {
            ...options,
            credentials : "include",
            headers : {
                ...(options.headers || {}),
            },

        });

        
    }
    
    return response;



}