


export async function checkAuth(){

    const response = await fetch("http://127.0.0.1:5000/auth/me", {
        method : "GET",
        headers : {
            "Authorization" : `Bearer ${window.accessToken}`
        }
    });

    const data = await response.json();
    console.log(data);


}