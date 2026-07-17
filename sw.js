const CACHE_NAME =
    "myaithingity-shell-v3";
const APP_FILES = [
    "./",
    "./index.html",
    "./character-creator.html",
    "./ai-models.html",
    "./manifest.json",
    "./css/style.css",
    "./css/creator.css",
    "./js/app.js",
    "./js/router.js",
    "./js/ai.js",
    "./js/webllm.js",
    "./js/aiManager.js",
    "./js/aiModels.js",
    "./js/modelManager.js",
    "./js/assetLoader.js",
    "./js/characterManager.js",
    "./js/characters.js",
    "./js/creator.js",
    "./js/memory.js",
    "./js/rules.js",
    "./js/ui.js",
    "./views/chat.html",
    "./views/characters.html",
    "./views/models.html",
    "./views/settings.html",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];
self.addEventListener(
    "install",
    event => {
        self.skipWaiting();
        event.waitUntil(
            caches.open(
                CACHE_NAME
            )
            .then(
                async cache => {
                    for (
                        const file of APP_FILES
                    ) {
                        try {
                            await cache.add(
                                file
                            );
                        }
                        catch(error) {
                            console.warn(
                                "Cache failed:",
                                file
                            );
                        }
                    }
                }
            )
        );
    }
);
self.addEventListener(
    "activate",
    event => {
        event.waitUntil(
            Promise.all([
                self.clients.claim(),
                caches.keys()
                .then(
                    keys => {
                        return Promise.all(
                            keys.map(
                                key => {
                                    if(
                                        key !== CACHE_NAME
                                    ) {
                                        return caches.delete(
                                            key
                                        );
                                    }
                                }
                            )
                        );
                    }
                )
            ])
        );
    }
);
self.addEventListener(
    "fetch",
    event => {
        const url =
        new URL(
            event.request.url
        );
        /*
            Ignore:
            - WebLLM CDN
            - model downloads
            - external resources
        */
        if(
            url.origin !== location.origin
        ) {
            return;
        }
        if (event.request.method !== "GET") {
            return;
        }
        event.respondWith(
            caches.match(
                event.request
            )
            .then(
                cached => {
                    const networkFetch = fetch(
                        event.request
                    )
                    .then(
                        response => {
                            if (
                                response &&
                                response.status === 200
                            ) {
                                const copy = response.clone();
                                caches.open(CACHE_NAME)
                                    .then(cache => cache.put(event.request, copy));
                            }
                            return response;
                        }
                    )
                    .catch(
                        () => cached
                    );
                    // Stale-while-revalidate: serve cached copy instantly if we
                    // have one, refresh it in the background for next time.
                    return cached || networkFetch;
                }
            )
        );
    }
);
