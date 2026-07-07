import {
    startAI,
    askAI
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
    Register the Service Worker
*/
if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./sw.js")
            .then(() => {

                console.log("Service Worker registered.");

            })
            .catch(error => {

                console.error(
                    "Service Worker failed:",
                    error
                );

            });

    });

}


let character;
let systemPrompt;


const chat =
document.getElementById("chat");

const input =
document.getElementById("message");

const button =
document.getElementById("send");

const status =
document.getElementById("status");


function addMessage(text, type) {

    const div =
    document.createElement("div");

    div.className =
    "message " + type;

    div.textContent =
    text;

    chat.appendChild(div);

    chat.scrollTop =
    chat.scrollHeight;

}


async function setup() {

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


    await startAI();


    status.textContent =
        `${character.metadata.name} ready`;



    if (character.chat.greeting) {

        addMessage(

            `${character.metadata.name}: ${character.chat.greeting}`,

            "ai"

        );

    }

}


async function sendMessage() {

    const text =
    input.value.trim();

    if (!text)
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


    const reply =
    await askAI(

        systemPrompt,

        getMemory()

    );


    addMessage(

        `${character.metadata.name}: ${reply}`,

        "ai"

    );


    saveMessage(

        "assistant",

        reply

    );

}


button.onclick =
sendMessage;


input.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            sendMessage();

        }

    }
);


setup();
