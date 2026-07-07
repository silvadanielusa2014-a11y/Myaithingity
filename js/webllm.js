let engine = null;


export async function loadModel(modelId, progressCallback) {


    if (!window.webllm) {

        throw new Error(
            "WebLLM not loaded"
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
            "Model not loaded"
        );

    }



    const response =

    await engine.chat.completions.create({

        messages,

        temperature:0.7,

        max_tokens:512

    });



    return response
        .choices[0]
        .message
        .content;

}



export function getEngine(){

    return engine;

}
