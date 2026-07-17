/*
    This used to maintain its own separate Cache Storage bucket
    (fetching model.file manually and stashing the raw response).
    That never actually fed into the inference engine — WebLLM's
    CreateMLCEngine() does its own download + caching internally,
    so this file now just wraps WebLLM's own cache-inspection
    helpers instead of duplicating the work.

    Requires window.webllm to already be loaded (see index.html's
    inline module script that assigns window.webllm = webllm).
*/

function requireWebLLM() {
    if (!window.webllm) {
        throw new Error(
            "WebLLM library is not loaded yet."
        );
    }
}

/*
    Check if a model is already downloaded and cached by WebLLM.
*/
export async function hasModel(modelId) {

    requireWebLLM();

    try {
        return await window.webllm.hasModelInCache(modelId);
    } catch (error) {
        console.warn(
            "hasModelInCache failed for",
            modelId,
            error
        );
        return false;
    }
}

/*
    Trigger a download by actually loading the model through the
    real engine (there's no separate "download without loading"
    step in WebLLM — loading IS the download-and-cache step).
    Progress is reported the same way loadModel() reports it.
*/
export async function downloadModel(model, progressCallback = () => {}) {

    requireWebLLM();

    const { loadModel } = await import("./webllm.js");

    await loadModel(model.id, progressCallback);

    return { success: true };
}

/*
    Remove a model's cached weights from WebLLM's own cache.
*/
export async function deleteModel(modelId) {

    requireWebLLM();

    try {
        await window.webllm.deleteModelAllInfoInCache(modelId);
        return true;
    } catch (error) {
        console.warn(
            "deleteModelAllInfoInCache failed for",
            modelId,
            error
        );
        return false;
    }
}

/*
    WebLLM doesn't expose a single "list everything cached" call
    the same way our old system did, since it isn't the one
    maintaining a flat key list — this is best-effort per-model
    checking instead, done by the caller looping known model IDs
    through hasModel().
*/
export async function getInstalledModels(knownModelIds = []) {

    const installed = [];

    for (const id of knownModelIds) {
        if (await hasModel(id)) {
            installed.push(id);
        }
    }

    return installed;
}
