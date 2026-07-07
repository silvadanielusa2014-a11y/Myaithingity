export async function loadCharacter(file) {

    const response = await fetch(
        `./characters/${file}`
    );


    if (!response.ok) {

        throw new Error(
            "Character not found"
        );

    }


    const character =
    await response.json();


    return normalizeCharacter(
        character
    );

}



function normalizeCharacter(character) {

    return {

        ...character,


        name:
        character.metadata?.name
        ?? "Unnamed Character",


        description:
        character.metadata?.description
        ?? "",


        personality:
        character.chat?.personality
        ?? [],


        speech_style:
        character.chat?.speech_style
        ?? {

            tone: "Neutral",

            uses_emojis: false

        },


        rules:
        character.chat?.rules
        ?? [],


        scenario:
        character.chat?.scenario
        ?? "",


        greeting:
        character.chat?.greeting
        ?? ""

    };

}




export function createCharacterPrompt(character) {

    return `

Character name:
${character.name}


Description:
${character.description}


Personality:
${character.personality.join(", ")}


Speaking style:

Tone:
${character.speech_style.tone}

Uses emojis:
${character.speech_style.uses_emojis}


Rules:

${character.rules.join("\n")}


Scenario:

${character.scenario}

`;

}
