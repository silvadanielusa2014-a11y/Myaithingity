import {
    createElement,
    clear
} from "./ui.js";


let models = [];


const container =
document.getElementById("models");



async function loadModels(){

    const response =
    await fetch(
        "./models/models.json"
    );


    const data =
    await response.json();


    models =
    data.models;


    renderModels();

}



function renderModels(){

    clear(container);


    models.forEach(model => {


        const card =
        createElement(
            "div",
            "model-card"
        );


        const title =
        createElement(
            "h2",
            "",
            model.name
        );


        const info =
        createElement(
            "p",
            "",
            `${model.provider} • ${model.size}`
        );


        const description =
        createElement(
            "p",
            "",
            model.description
        );


        const button =
        createElement(
            "button",
            "",
            model.installed
            ? "Remove"
            : "Download"
        );


        card.appendChild(title);

        card.appendChild(info);

        card.appendChild(description);

        card.appendChild(button);


        container.appendChild(card);


    });

}



loadModels();
