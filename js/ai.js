import {

    loadModel,

    generate

} from "./webllm.js";



let activeModel = null;



export async function startAI(
    model
){

    activeModel =
    model;


    await loadModel(

        model,

        progress => {

            console.log(
                progress.text
            );

        }

    );

}



export async function askAI(
    systemPrompt,
    memory
){


    const messages = [

        {

            role:"system",

            content:
            systemPrompt

        },


        ...memory.map(message => ({

            role:
            message.role,

            content:
            message.content

        }))

    ];



    return await generate(
        messages
    );

}
