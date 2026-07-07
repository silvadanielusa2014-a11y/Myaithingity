import {

    startAI,

    askAI,

    askAIStream

} from "./ai.js";



let ready = false;

let activeModel = null;



export async function initializeAI(
    modelId
) {


    activeModel =
        modelId;


    await startAI(
        modelId
    );


    ready = true;

}



export async function chat(
    systemPrompt,
    memory
) {


    if (!ready) {

        throw new Error(
            "AI is not initialized."
        );

    }


    return await askAI(

        systemPrompt,

        memory

    );

}



export async function chatStream(
    systemPrompt,
    memory,
    callback
) {


    if (!ready) {

        throw new Error(
            "AI is not initialized."
        );

    }


    return await askAIStream(

        systemPrompt,

        memory,

        callback

    );

}



export function isAIReady(){

    return ready;

}



export function getActiveModel(){

    return activeModel;

}
