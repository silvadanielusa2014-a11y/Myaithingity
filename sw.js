const CACHE_NAME =
    "myaithingity-shell-v2";



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

    "./js/ui.js",



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




    "./views/chat.html",

    "./views/characters.html",

    "./views/models.html",

    "./views/settings.html"



];






self.addEventListener(

    "install",

    event => {


        event.waitUntil(


            caches.open(
                CACHE_NAME
            )

            .then(

                async cache => {


                    for (

                        const file

                        of APP_FILES

                    ) {


                        try {


                            await cache.add(
                                file
                            );


                        }


                        catch(error) {


                            console.warn(

                                "Failed to cache:",
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


            caches.keys()

            .then(

                keys => {


                    return Promise.all(

                        keys.map(

                            key => {


                                if(

                                    key !== CACHE_NAME

                                ){

                                    return caches.delete(
                                        key
                                    );

                                }


                            }

                        )

                    );


                }

            )


        );


    }

);








self.addEventListener(

    "fetch",

    event => {


        event.respondWith(


            caches.match(

                event.request

            )

            .then(

                cached => {


                    if(cached){

                        return cached;

                    }



                    return fetch(
                        event.request
                    );


                }

            )


        );


    }

);
