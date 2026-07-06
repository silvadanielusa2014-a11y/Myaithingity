export function createCharacter(data) {

    return {

        name: data.name || "Unnamed",

        description:
            data.description || "",

        personality:
            data.personality || [],

        speech_style: {

            tone:
            data.tone || "normal",

            uses_emojis:
            data.emojis || false

        },

        rules:
            data.rules || [
                "Stay in character."
            ],

        scenario:
            data.scenario || ""

    };

}


export function exportCharacter(character) {

    const json =
        JSON.stringify(
            character,
            null,
            4
        );


    const blob =
        new Blob(
            [json],
            {
                type:
                "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        `${character.name}.json`;


    link.click();


    URL.revokeObjectURL(url);

}
