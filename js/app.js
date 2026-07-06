import { startAI, askAI } from "./ai.js";

const chat = document.getElementById("chat");
const status = document.getElementById("status");
const input = document.getElementById("message");
const send = document.getElementById("send");


function addMessage(text, type) {

    const div = document.createElement("div");

    div.className = "message " + type;

    div.textContent = text;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;

}


async function main() {

    status.textContent = "Loading AI model...";

    await startAI();

    status.textContent = "AI ready.";

}


async function sendMessage() {

    const text = input.value.trim();

    if (!text) return;

    input.value = "";

    addMessage("You: " + text, "user");

    const response = await askAI(text);

    addMessage("AI: " + response, "ai");

}


send.addEventListener("click", sendMessage);


input.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        sendMessage();
    }

});


main();
