let refreshFailed = false;

export async function apiFetch(url, options = {}) {

    if (refreshFailed) {
        return fetch(url, options);
    }

    let response = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    if (response.status !== 401) return response;

    const refreshResponse = await fetch("/auth/refresh", {
        method: "POST",
        credentials: "include"
    });

    if (!refreshResponse.ok) {
        refreshFailed = true; 
        return response;
    }

    return fetch(url, {
        ...options,
        credentials: "include"
    });
}