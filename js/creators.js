// Builds a character JSON matching the schema the app actually reads
// (see characters/default.json) and offers it as a download. There was
// no existing creator.js in the repo to preserve — this is written fresh
// against the form fields already defined in views/creator.html.

function slugify(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "character";
}

async function populateModelChoices(select) {
    try {
        const response = await fetch("./models/models.json");
        const data = await response.json();

        select.innerHTML = "";

        for (const model of data.models) {
            const option = document.createElement("option");
            option.value = model.id;
            option.textContent = `${model.name} (${model.size})`;
            select.appendChild(option);
        }
    } catch (error) {
        console.error("Could not load models.json for creator:", error);
    }
}

function buildCharacterJSON(fields, modelId, modelLabel) {
    return {
        id: slugify(fields.name),

        metadata: {
            name: fields.name,
            creator: "You",
            description: fields.description
        },

        asset_file: null,

        chat: {
            greeting: `Hey, I'm ${fields.name}.`,
            scenario: fields.scenario,
            personality: fields.personality
                .split(",")
                .map(t => t.trim())
                .filter(Boolean),
            speech_style: {
                tone: fields.tone,
                uses_emojis: fields.emojis === "true"
            },
            rules: fields.rules
                .split("\n")
                .map(r => r.trim())
                .filter(Boolean)
        },

        memory: {
            enabled: true,
            remember_user: true
        },

        ai: {
            preferred_model: modelId,
            display_model: modelLabel
        }
    };
}

function downloadJSON(data, filename) {
    const blob = new Blob(
        [JSON.stringify(data, null, 4)],
        { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

function setupCreator() {

    const nameInput = document.getElementById("name");
    const descriptionInput = document.getElementById("description");
    const personalityInput = document.getElementById("personality");
    const toneInput = document.getElementById("tone");
    const emojisSelect = document.getElementById("emojis");
    const scenarioInput = document.getElementById("scenario");
    const rulesInput = document.getElementById("rules");
    const modelSelect = document.getElementById("model");
    const createButton = document.getElementById("create");

    if (!createButton) return; // fragment not actually mounted, bail quietly

    populateModelChoices(modelSelect);

    createButton.onclick = () => {

        if (!nameInput.value.trim()) {
            alert("Give the character a name first.");
            return;
        }

        const fields = {
            name: nameInput.value,
            description: descriptionInput.value,
            personality: personalityInput.value,
            tone: toneInput.value,
            emojis: emojisSelect.value,
            scenario: scenarioInput.value,
            rules: rulesInput.value
        };

        const selectedOption = modelSelect.options[modelSelect.selectedIndex];

        const character = buildCharacterJSON(
            fields,
            modelSelect.value,
            selectedOption ? selectedOption.textContent.replace(/\s*\(.*\)$/, "") : ""
        );

        downloadJSON(character, `${character.id}.json`);
    };
}

document.addEventListener(
    "pageLoaded",
    event => {

        if (event.detail.page === "creator") {
            setupCreator();
        }

    }
);
