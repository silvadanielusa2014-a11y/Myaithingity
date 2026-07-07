import {

    loadModel,

    generate,

    generateStream

} from "./webllm.js";



let currentModel = null;



export async function startAI(
    modelId
) {

    if (!modelId) {

        throw new Error(
            "No AI model selected."
        );

    }

    currentModel =
        modelId;


    await loadModel(

        modelId,

        progress => {

            console.log(
                progress.text
            );

        }

    );

}



function buildMessages(
    systemPrompt,
    memory
) {


    return [

        {

            role: "system",

            content:
            systemPrompt

        },


        ...memory.map(
            message => ({

                role:
                message.role,

                content:
                message.content

            })

        )

    ];

}



export async function askAI(
    systemPrompt,
    memory
) {


    return await generate(

        buildMessages(

            systemPrompt,

            memory

        )

    );

}



export async function askAIStream(
    systemPrompt,
    memory,
    callback
) {


    return await generateStream(

        buildMessages(

            systemPrompt,

            memory

        ),

        callback

    );

}



export function getCurrentModel(){

    return currentModel;

}
