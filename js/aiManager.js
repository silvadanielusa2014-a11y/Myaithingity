import {
    startAI,
    askAI
} from "./ai.js";


let currentModel = null;

let initialized = false;



export async function initializeAI(modelId) {


    currentModel = modelId;


    await startAI(
        modelId
    );


    initialized = true;

}



export async function generateResponse(
    systemPrompt,
    memory
) {


    if (!initialized) {

        throw new Error(
            "AI not initialized"
        );

    }


    return await askAI(

        systemPrompt,

        memory

    );

}



export function getCurrentModel(){

    return currentModel;

}



export function isReady(){

    return initialized;

}
