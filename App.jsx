import { useState } from "react"
import { clsx } from "clsx"
import { languages } from "./languages"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from "react-confetti"


export default function AssemblyEndgame() {
    // Valores de estado
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])

    // Valores derivados
    const numGuessesLeft = languages.length - 1
    const wrongGuessCount =
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const isGameWon =
        currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= numGuessesLeft
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    // Valores estáticos
    const alphabet = "abcdefghijklmnopqrstuvwxyz "

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters =>
            prevLetters.includes(letter) ?
                prevLetters :
                [...prevLetters, letter]
        )
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span
                className={className}
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    })

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return (
            <span key={index} className={letterClassName}>
                {shouldRevealLetter ? letter.toUpperCase() : ""}
            </span>
        )
    })

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return (
            <button
                className={className}
                key={letter}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letra ${letter}`}
                onClick={() => addGuessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return (
                <p className="farewell-message">
                    {getFarewellText(languages[wrongGuessCount - 1].name)}
                </p>
            )
        }

        if (isGameWon) {
            return (
                <>
                    <h2>¡Ganaste!</h2>
                    <p>¡Bien hecho! 🎉</p>
                </>
            )
        }
        if (isGameLost) {
            return (
                <>
                    <h2>¡Juego terminado!</h2>
                    <p>¡Perdiste! Mejor empieza a aprender Assembly 😭</p>
                </>
            )
        }

        return null
    }

    return (
        <main>
            {
                isGameWon && 
                    <Confetti
                        recycle={false}
                        numberOfPieces={1000}
                    />
            }
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Adivina la palabra en 8 intentos para salvar al mundo hispanoablente de Assembly.</p>
            </header>

            <section
                aria-live="polite"
                role="status"
                className={gameStatusClass}
            >
                {renderGameStatus()}
            </section>

            <section className="language-chips">
                {languageElements}
            </section>

            <section className="word">
                {letterElements}
            </section>

            {/* Región combinada oculta visualmente para actualizaciones de estado */}
            <section
                className="sr-only"
                aria-live="polite"
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ?
                        `¡Correcto! La letra ${lastGuessedLetter} está en la palabra.` :
                        `Lo siento, la letra ${lastGuessedLetter} no está en la palabra.`
                    }
                    Te quedan {numGuessesLeft} intentos.
                </p>
                <p>Palabra actual: {currentWord.split("").map(letter =>
                    guessedLetters.includes(letter) ? letter + "." : "blanco.")
                    .join(" ")}</p>

            </section>

            <section className="keyboard">
                {keyboardElements}
            </section>

            {isGameOver &&
                <button
                    className="new-game"
                    onClick={startNewGame}
                >Nuevo Juego</button>}
        </main>
    )
}
