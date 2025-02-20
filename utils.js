import { words } from "./words"

export function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
}

export function getFarewellText(language) {
const options = [
    `Adiós, ${language}`, 
    `Descanse en paz, ${language}`,
    `Te extrañaremos, ${language}`,
    `¡Oh no, ¡no ${language}!`,
    `${language} muerde el polvo`,
    `Se fue pero no olvidado, ${language}`,
    `El fin de ${language} tal como lo conocemos`,
    `Hacia el atardecer, ${language}`,
    `${language}, ha sido real`,
    `${language}, tu vigilancia ha terminado`,
    `${language} ha abandonado el edificio`
];

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}