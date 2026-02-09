import { WORD_LIST } from './words.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup Word List and Random Selection from the imported file
    const targetWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].toLowerCase();
    
    // 2. Game State
    let guessedWords = [[]]; 
    let availableSpace = 1;
    let wordIndex = 0;
    const maxTries = 5; 

    createSquares();

    const keys = document.querySelectorAll(".keyboard-button");

    // Initialize the grid squares (5 columns x 5 rows)
    function createSquares() {
        const gameBoard = document.getElementById("game-board");
        gameBoard.innerHTML = ""; 
        for (let index = 0; index < 25; index++) {
            let square = document.createElement("div");
            square.classList.add("tile");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    // ... [The rest of your existing functions: handleInput, updateGuessedWords, 
    // handleDeleteLetter, handleSubmitWord, getTileColor remain exactly the same]


    // Handle on-screen keyboard clicks
    keys.forEach(key => {
        key.addEventListener("click", () => {
            const letter = key.getAttribute("data-key");
            handleInput(letter);
        });
    });

    // Handle physical keyboard presses
    document.addEventListener("keydown", (e) => {
        const letter = e.key.toLowerCase();
        if (letter === "enter") {
            handleInput("enter");
        } else if (letter === "backspace") {
            handleInput("del");
        } else if (/^[a-z]$/.test(letter)) {
            handleInput(letter);
        }
    });

    function handleInput(key) {
        if (wordIndex >= maxTries) return; // Game over, no more input

        if (key === "enter") {
            handleSubmitWord();
        } else if (key === "del") {
            handleDeleteLetter();
        } else {
            updateGuessedWords(key);
        }
    }

    function updateGuessedWords(letter) {
        const currentWordArr = guessedWords[guessedWords.length - 1];

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);
            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpaceEl.textContent = letter;
            availableSpace = availableSpace + 1;
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = guessedWords[guessedWords.length - 1];
        
        if (currentWordArr.length > 0) {
            currentWordArr.pop();
            availableSpace = availableSpace - 1;
            const lastLetterEl = document.getElementById(String(availableSpace));
            lastLetterEl.textContent = "";
        }
    }

    function handleSubmitWord() {
        const currentWordArr = guessedWords[guessedWords.length - 1];

        if (currentWordArr.length !== 5) {
            alert("Word must be 5 letters");
            return;
        }

        const currentWord = currentWordArr.join("");
        const firstLetterId = wordIndex * 5 + 1;
        
        currentWordArr.forEach((letter, index) => {
            const letterId = firstLetterId + index;
            const tile = document.getElementById(String(letterId));
            const tileColor = getTileColor(letter, index);

            setTimeout(() => {
                tile.classList.add("animate__animated", "animate__flipInX");
                tile.classList.add(tileColor);
            }, index * 100);
        });

        // Winning Logic
        if (currentWord === targetWord) {
            wordIndex = 100; // Lock game
            setTimeout(() => showMessage("YOU WON", "Great job!"), 1000);
            return;
        }

        wordIndex += 1;

        // Losing Logic
        if (wordIndex === maxTries) {
            setTimeout(() => showMessage("YOU LOST, TRY AGAIN", `The word was: ${targetWord.toUpperCase()}`), 1000);
        } else {
            guessedWords.push([]);
        }
    }

    function showMessage(status, sub) {
        const overlay = document.getElementById("message-overlay");
        const statusText = document.getElementById("status-text");
        const subText = document.getElementById("sub-text");

        statusText.textContent = status;
        subText.textContent = sub;
        overlay.classList.remove("hidden");
    }

    function getTileColor(letter, index) {
        if (targetWord[index] === letter) {
            return "correct";
        } else if (targetWord.includes(letter)) {
            return "present";
        }
        return "absent";
    }
});