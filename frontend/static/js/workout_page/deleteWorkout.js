

import {API_URL} from "../config.js";
import {renderLastWorkout} from "./loadLastWorkout.js"
import {loadLastWorkout} from "./loadLastWorkout.js"
import { apiFetch } from "../auth/apiFetch.js";

export async function deleteWorkout(workout_id){

    try{
        const response = await apiFetch(`${API_URL}/workout/delete/${workout_id}`, {method : "DELETE"})
        
        if (!response.ok){
            const err = await response.json();
            console.log(err);
            return false;

        }

        console.log("Тренировка успешно удалена")
        const workout = await loadLastWorkout();
        
        if (workout) {
            await renderLastWorkout(workout);
        } else {
            console.log("Нет тренировок");
        }

        return true;


    }

    catch(error){
        console.log(error);
    }

}