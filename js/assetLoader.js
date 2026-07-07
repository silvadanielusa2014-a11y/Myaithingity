const CACHE_NAME = "myaithingity-assets-v1";

/*
    Opens (or creates) the asset cache.
*/
async function getCache() {

    return await caches.open(CACHE_NAME);

}

/*
    Checks if a string looks like a URL.
*/
function isURL(text) {

    if (typeof text !== "string")
        return false;

    return (
        text.startsWith("http://") ||
        text.startsWith("https://")
    );

}

/*
    Loads one asset.

    Returns:

    {
        success: true/false,
        url: "...",
        cached: true/false
    }
*/
export async function loadAsset(url) {

    if (!isURL(url)) {

        return {

            success: false,
            url: null,
            cached: false

        };

    }

    const cache = await getCache();

    const cachedResponse = await cache.match(url);

    if (cachedResponse) {

        return {

            success: true,
            url,
            cached: true

        };

    }

    if (!navigator.onLine) {

        return {

            success: false,
            url: null,
            cached: false

        };

    }

    try {

        const response = await fetch(url);

        if (!response.ok) {

            return {

                success: false,
                url: null,
                cached: false

            };

        }

        await cache.put(
            url,
            response.clone()
        );

        return {

            success: true,
            url,
            cached: false

        };

    }

    catch {

        return {

            success: false,
            url: null,
            cached: false

        };

    }

}

/*
    Recursively caches every URL
    inside an object.
*/
export async function cacheAssets(object) {

    if (!object)
        return;

    if (typeof object === "string") {

        if (isURL(object))
            await loadAsset(object);

        return;

    }

    if (Array.isArray(object)) {

        for (const item of object)
            await cacheAssets(item);

        return;

    }

    if (typeof object === "object") {

        for (const value of Object.values(object))
            await cacheAssets(value);

    }

}

/*
    Removes every cached asset.
*/
export async function clearAssetCache() {

    await caches.delete(CACHE_NAME);

}

/*
    Returns every cached URL.
*/
export async function getCachedAssets() {

    const cache = await getCache();

    const requests = await cache.keys();

    return requests.map(request => request.url);

}

/*
    Removes one asset from cache.
*/
export async function removeAsset(url) {

    const cache = await getCache();

    await cache.delete(url);

}

/*
    Downloads every asset before
    the user goes offline.
*/
export async function preloadAssets(assetObject) {

    await cacheAssets(assetObject);

}
