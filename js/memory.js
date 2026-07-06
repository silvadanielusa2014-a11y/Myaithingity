const MEMORY_KEY =
"myaithingity_memory";


export function getMemory(){

    return JSON.parse(
        localStorage.getItem(MEMORY_KEY)
        || "[]"
    );

}


export function saveMessage(role, content){

    const memory =
    getMemory();


    memory.push({

        role,
        content

    });


    localStorage.setItem(

        MEMORY_KEY,

        JSON.stringify(memory)

    );

}


export function clearMemory(){

    localStorage.removeItem(
        MEMORY_KEY
    );

}
