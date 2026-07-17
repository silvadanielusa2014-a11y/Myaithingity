let engine = null;


export async function loadModel(
    modelId,
    progressCallback = () => {}
) {

    if (!window.webllm) {

        throw new Error(
            "WebLLM library is not loaded."
        );

    }


    engine =
        await window.webllm.CreateMLCEngine(

            modelId,

            {

                initProgressCallback:
                progressCallback

            }

        );


    return engine;

}



export async function generate(
    messages
) {

    if (!engine) {

        throw new Error(
            "No AI model loaded."
        );

    }


    const response =
        await engine.chat.completions.create({

            messages,

            temperature: 0.7,

            max_tokens: 512

        });


    return (
        response
        .choices[0]
        .message
        .content
    );

}



export async function generateStream(
    messages,
    callback
) {

    if (!engine) {

        throw new Error(
            "No AI model loaded."
        );

    }



    const stream =
        await engine.chat.completions.create({

            messages,

            temperature: 0.7,

            max_tokens: 512,

            stream: true

        });



    let fullResponse = "";



    for await (const chunk of stream) {


        const token =
            chunk
            .choices[0]
            ?.delta
            ?.content;



        if (token) {

            fullResponse += token;


            callback(
                token,
                fullResponse
            );

        }

    }



    return fullResponse;

}



export function getEngine() {

    return engine;

}
