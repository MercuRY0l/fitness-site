

export async function refreshAccessToken(){
    try{
    
        const response = await fetch("http://127.0.0.1:5000/auth/refresh",{
            method : "POST",
            credentials : "include"
        })

        if (!response.ok){
            const error = await response.json();
            console.error("Ошибка обновления токена", error.detail);
            return null;
        }

        const data = await response.json();
        return data.access_token;
    }

    catch(err){
        console.log("Ошибка при  выполнении fetch", err);
        return null;
    }
}