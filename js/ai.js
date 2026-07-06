import * as webllm from
"https://esm.run/@mlc-ai/web-llm";


let engine;


export async function startAI(){

    engine =
    await webllm.CreateMLCEngine(

        "Llama-3.2-1B-Instruct-q4f16_1"

    );

}


export async function askAI(
    systemPrompt,
    messages
){

    const response =
    await engine.chat.completions.create({

        messages:[

            {
                role:"system",
                content:systemPrompt
            },

            ...messages

        ]

    });


    return response
        .choices[0]
        .message
        .content;

}
