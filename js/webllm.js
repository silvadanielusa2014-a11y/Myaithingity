let engine = null;

async function checkWebGPU() {
    if (!("gpu" in navigator)) {
        throw new Error(
            "WebGPU isn't available in this browser context. " +
            "On desktop Chrome/Edge this should just work — if you're seeing " +
            "this there, the browser may be too old. On Chrome for Android, " +
            "enable chrome://flags/#enable-unsafe-webgpu and relaunch."
        );
    }

    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
        throw new Error(
            "navigator.gpu.requestAdapter() returned null. WebGPU is exposed " +
            "but no compatible GPU adapter was found — check that hardware " +
            "acceleration is enabled in the browser and GPU drivers are current."
        );
    }

    return adapter;
}

export async function loadModel(
    modelId,
    progressCallback = () => {}
) {
    if (!window.webllm) {
        throw new Error(
            "WebLLM library is not loaded."
        );
    }

    // Fail fast with a clear message instead of letting CreateMLCEngine
    // throw an opaque internal error if WebGPU isn't usable here.
    await checkWebGPU();

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
