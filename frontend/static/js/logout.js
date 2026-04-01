

export async function logout(){

    try {
        const response = await fetch("http://127.0.0.1:5000/auth/logout",{
            method : "POST",
            credentials : "include"
            }
        )

        const data = await response.json()

        if (!response.ok){
            console.error("Ошибка logout", data.detail)

        }

        console.log("Успешный выход из аккаунта")
    }

    catch{
        console.error("Произошла ошибка при выполнении запроса.")
    }
}