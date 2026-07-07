import {
    loadPage
} from "./router.js";


import {
    startAI,
    askAIStream
} from "./ai.js";


import {
    loadCharacter,
    createCharacterPrompt
} from "./characters.js";


import {
    getMemory,
    saveMessage
} from "./memory.js";


import {
    globalRules
} from "./rules.js";



/*
    Register Service Worker
*/

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(() => {

                    console.log(
                        "Service Worker registered."
                    );

                })
                .catch(error => {

                    console.error(
                        "Service Worker failed:",
                        error
                    );

                });

        }

    );

}



let character;

let systemPrompt;



function addMessage(
    text,
    type
) {


    const chat =
    document.getElementById(
        "chat"
    );


    if (!chat)
        return;



    const div =
    document.createElement(
        "div"
    );


    div.className =
        "message " + type;



    div.textContent =
        text;



    chat.appendChild(
        div
    );



    chat.scrollTop =
        chat.scrollHeight;


    return div;

}





async function setupChat(){


    const status =
    document.getElementById(
        "status"
    );



    status.textContent =
        "Loading character...";



    character =
        await loadCharacter(
            "default.json"
        );



    systemPrompt =

        globalRules +

        "\n\n" +

        createCharacterPrompt(
            character
        );



    status.textContent =
        "Loading AI...";



    await startAI(

        character.ai
        ?.preferred_model

    );



    status.textContent =

        `${character.metadata.name} ready`;




    if(character.chat.greeting){


        addMessage(

            `${character.metadata.name}: ${character.chat.greeting}`,

            "ai"

        );

    }


}





async function sendMessage(){


    const input =
    document.getElementById(
        "message"
    );


    const text =
    input.value.trim();



    if(!text)
        return;



    input.value = "";



    addMessage(

        "You: " + text,

        "user"

    );



    saveMessage(

        "user",

        text

    );



    const replyBox =
        addMessage(

            character.metadata.name + ": ",

            "ai"

        );



    let fullReply = "";



    await askAIStream(

        systemPrompt,

        getMemory(),


        token => {


            fullReply += token;


            replyBox.textContent =

                `${character.metadata.name}: ${fullReply}`;


        }

    );



    saveMessage(

        "assistant",

        fullReply

    );


}







document.addEventListener(

    "pageLoaded",

    event => {


        if(

            event.detail.page === "chat"

        ){


            const button =
            document.getElementById(
                "send"
            );


            const input =
            document.getElementById(
                "message"
            );



            button.onclick =
                sendMessage;



            input.addEventListener(

                "keydown",

                event => {


                    if(
                        event.key === "Enter"
                    ){

                        sendMessage();

                    }


                }

            );



            setupChat();


        }


    }

);





document
.querySelectorAll(
    "[data-page]"
)

.forEach(

    button => {


        button.onclick =
        () => {


            loadPage(

                button.dataset.page

            );


        };


    }

);





loadPage(
    "chat"
);
