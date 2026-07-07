import {
    startAI,
    askAI
} from "./ai.js";



let currentModel = null;

let ready = false;



const DEFAULT_MODEL =
"Llama-3.2-1B-Instruct";



export async function initializeAI(
    model = DEFAULT_MODEL
){

    currentModel = model;


    console.log(
        "Loading AI:",
        currentModel
    );


    await startAI(
        currentModel
    );


    ready = true;


}



export async function generateResponse(
    systemPrompt,
    messages
){

    if(!ready){

        throw new Error(
            "AI not initialized"
        );

    }


    return await askAI(

        systemPrompt,

        messages

    );

}



export function getCurrentModel(){

    return currentModel;

}



export function isAIReady(){

    return ready;

}



export function unloadAI(){

    currentModel = null;

    ready = false;

}
