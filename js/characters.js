export async function loadCharacter(file) {

    const response = await fetch(
        `characters/${file}`
    );

    if (!response.ok) {
        throw new Error("Character not found");
    }

    return await response.json();

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
Tone: ${character.speech_style.tone}
Uses emojis: ${character.speech_style.uses_emojis}

Rules:
${character.rules.join("\n")}

Scenario:
${character.scenario}
`;
}
