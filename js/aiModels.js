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



        // Progress readout — hidden until a download is actually in
        // flight, so installed/idle cards stay clean.
        const progressText =
        createElement(
            "p",
            "model-progress",
            ""
        );
        progressText.style.display = "none";

        const progressTrack =
        createElement(
            "div",
            "model-progress-track"
        );
        progressTrack.style.display = "none";

        const progressFill =
        createElement(
            "div",
            "model-progress-fill"
        );
        progressTrack.appendChild(progressFill);



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

                progressText.style.display = "block";
                progressTrack.style.display = "block";
                progressText.textContent = "Starting download…";

                try {

                    await downloadModel(
                        model,
                        report => {

                            // WebLLM's progress reports carry a 0-1
                            // "progress" value and a human-readable
                            // "text" field — use both if present.
                            const pct =
                                typeof report.progress === "number"
                                ? Math.round(report.progress * 100)
                                : null;

                            progressFill.style.width =
                                (pct ?? 0) + "%";

                            progressText.textContent =
                                pct !== null
                                ? `${report.text || "Downloading"} (${pct}%)`
                                : (report.text || "Downloading…");

                        }
                    );

                    progressText.textContent = "Done.";

                } catch (error) {

                    console.error(
                        "Model download failed:",
                        error
                    );

                    progressText.textContent =
                        "Download failed — see console for details.";

                    button.disabled = false;
                    return;

                }

            }



            await renderModels();


        };



        card.appendChild(title);

        card.appendChild(info);

        card.appendChild(description);

        card.appendChild(progressText);

        card.appendChild(progressTrack);

        card.appendChild(button);


        container.appendChild(card);


    }

}



loadModels();
