const models = [

    {
        id:
        "Llama-3.2-1B-Instruct",

        name:
        "Llama 3.2 1B",

        size:
        "≈700MB",

        installed:
        false

    },

    {
        id:
        "Phi-4-mini",

        name:
        "Phi-4 Mini",

        size:
        "≈2GB",

        installed:
        false

    }

];



const container =
document.getElementById("models");



function renderModels(){


    container.innerHTML = "";


    models.forEach(model => {


        const card =
        document.createElement("div");


        card.className =
        "model-card";


        card.innerHTML = `

            <h2>
            ${model.name}
            </h2>

            <p>
            Size: ${model.size}
            </p>

            <p>
            Status:
            ${model.installed
                ? "Installed"
                : "Not installed"}
            </p>

            <button>
            ${
                model.installed
                ? "Remove"
                : "Download"
            }
            </button>

        `;


        container.appendChild(card);


    });


}


document
.getElementById("back")
.onclick = () => {

    history.back();

};


renderModels();
