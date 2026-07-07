const CACHE_NAME = "myaithingity-assets-v1";

/*
    Opens (or creates) the asset cache.
*/
async function getCache() {

    return await caches.open(CACHE_NAME);

}


/*
    Loads a single asset.

    Cache
        ↓
    Internet
        ↓
    Cache + Return
*/
export async function loadAsset(url) {

    if (!url)
        return null;

    const cache = await getCache();

    const cached = await cache.match(url);

    if (cached) {

        console.log("Loaded from cache:", url);

        return url;

    }

    if (!navigator.onLine) {

        console.warn("Offline:", url);

        return null;

    }

    try {

        const response = await fetch(url);

        if (!response.ok)
            return null;

        await cache.put(
            url,
            response.clone()
        );

        console.log("Cached:", url);

        return url;

    }

    catch (error) {

        console.error(error);

        return null;

    }

}


/*
    Loads every asset in an object.

    Example:

    await cacheAssets(character.assets.images);
*/
export async function cacheAssets(object) {

    if (!object)
        return;

    for (const value of Object.values(object)) {

        if (typeof value === "string") {

            await loadAsset(value);

        }

        else if (Array.isArray(value)) {

            for (const item of value) {

                if (typeof item === "string")
                    await loadAsset(item);

            }

        }

        else if (typeof value === "object") {

            await cacheAssets(value);

        }

    }

}


/*
    Is a URL cached?
*/
export async function isCached(url) {

    const cache = await getCache();

    return (
        await cache.match(url)
    ) !== undefined;

}


/*
    Remove every cached asset.
*/
export async function clearCache() {

    await caches.delete(CACHE_NAME);

}


/*
    Returns every cached request.
*/
export async function getCachedAssets() {

    const cache = await getCache();

    return await cache.keys();

}
