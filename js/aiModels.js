import {
    createElement,
    clear
} from "./ui.js";


import {
    downloadModel,
    deleteModel,
    hasModel
} from "./modelManager.js";



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


    await renderModels();

}




async function renderModels(){


    clear(container);


    for(const model of models){


        const installed =
        await hasModel(
            model.id
        );



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
            installed
            ? "Remove"
            : "Download"
        );



        button.onclick =
        async () => {


            button.disabled =
            true;



            if(installed){


                await deleteModel(
                    model.id
                );


            }

            else {


                button.textContent =
                "Downloading...";


                await downloadModel(
                    model
                );


            }



            await renderModels();


        };



        card.appendChild(title);

        card.appendChild(info);

        card.appendChild(description);

        card.appendChild(button);


        container.appendChild(card);


    }

}



loadModels();
