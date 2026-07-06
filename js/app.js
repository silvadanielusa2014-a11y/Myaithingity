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


function addMessage(text,type){

    const div =
    document.createElement("div");

    div.className =
    "message " + type;

    div.textContent =
    text;

    chat.appendChild(div);

}



async function setup(){

    status.textContent =
    "Loading character...";


    character =
    await loadCharacter(
        "default.json"
    );


    systemPrompt =
        globalRules
        +
        "\n\n"
        +
        createCharacterPrompt(
            character
        );


    status.textContent =
    "Loading AI...";


    await startAI();


    status.textContent =
    `${character.name} ready`;

}



async function sendMessage(){

    const text =
    input.value.trim();


    if(!text)return;


    input.value="";


    addMessage(
        "You: "+text,
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

        character.name+
        ": "+
        reply,

        "ai"

    );


    saveMessage(

        "assistant",

        reply

    );

}



button.onclick =
sendMessage;


input.onkeydown =
(e)=>{

    if(e.key==="Enter")
        sendMessage();

};


setup();
