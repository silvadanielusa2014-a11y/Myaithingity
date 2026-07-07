export function createCharacter(data) {

    return {

        id:
        data.id || "custom-character",


        metadata: {

            name:
            data.name || "Unnamed Character",

            creator:
            data.creator || "Unknown",

            description:
            data.description || ""

        },


        asset_file:
        data.asset_file || "defaultAssets.json",



        chat: {

            greeting:
            data.greeting || "",


            scenario:
            data.scenario || "",


            personality:
            data.personality || [],


            speech_style: {

                tone:
                data.tone || "Normal",


                uses_emojis:
                data.emojis || false

            },


            rules:
            data.rules || [

                "Stay in character."

            ]

        },


        memory: {

            enabled: true,

            remember_user: true

        },


        ai: {

            preferred_model:
            data.model || "llama-3.2-1b"

        }

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



    link.href =
    url;



    link.download =
    `${character.metadata.name}.json`;



    link.click();



    URL.revokeObjectURL(url);

}
