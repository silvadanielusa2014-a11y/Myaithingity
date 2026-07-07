const MODEL_CACHE =
"myaithingity-models-v1";



async function getModelCache(){

    return await caches.open(
        MODEL_CACHE
    );

}



/*
    Download a model
*/
export async function downloadModel(model){


    if(!model.file){

        throw new Error(
            "Model has no download URL"
        );

    }


    const cache =
    await getModelCache();



    const existing =
    await cache.match(
        model.id
    );


    if(existing){

        return {

            success:true,

            cached:true

        };

    }



    const response =
    await fetch(
        model.file
    );


    if(!response.ok){

        return {

            success:false,

            cached:false

        };

    }



    await cache.put(

        model.id,

        response

    );



    return {

        success:true,

        cached:false

    };


}





/*
    Check if model exists
*/
export async function hasModel(id){

    const cache =
    await getModelCache();


    const result =
    await cache.match(id);


    return result !== undefined;

}





/*
    Delete model
*/
export async function deleteModel(id){

    const cache =
    await getModelCache();


    return await cache.delete(
        id
    );

}





/*
    Get installed models
*/
export async function getInstalledModels(){

    const cache =
    await getModelCache();


    const keys =
    await cache.keys();


    return keys.map(
        request => request.url
    );

}





/*
    Remove every model
*/
export async function clearModels(){

    return await caches.delete(
        MODEL_CACHE
    );

}
