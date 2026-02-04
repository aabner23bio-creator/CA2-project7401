document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]]; // Array of arrays of letters
    let availableSpace = 1;
    let wordIndex = 0;
    
    // THE SECRET WORD (You can change this!)
    const targetWord = "CELLS"; 

    const keys = document.querySelectorAll(".keyboard-row button");

    // Initialize the grid squares
    function createSquares() {
        const gameBoard = document.getElementById("game-board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("tile");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    // Handle on-screen keyboard clicks
    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === "enter") {
                handleSubmitWord();
                return;
            }

            if (letter === "del") {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter);
        };
    }

    // Handle physical keyboard presses
    document.addEventListener("keydown", (e) => {
        const letter = e.key.toLowerCase();
        
        if (letter === "enter") {
            handleSubmitWord();
        } else if (letter === "backspace") {
            handleDeleteLetter();
        } else if (/^[a-z]$/.test(letter)) {
            updateGuessedWords(letter);
        }
    });

    function updateGuessedWords(letter) {
        const currentWordArr = guessedWords[guessedWords.length - 1];

        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);
            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    function handleDeleteLetter() {
        const currentWordArr = guessedWords[guessedWords.length - 1];
        
        if (currentWordArr.length > 0) {
            currentWordArr.pop();
            guessedWords[guessedWords.length - 1] = currentWordArr;
            const lastLetterEl = document.getElementById(String(availableSpace - 1));
            lastLetterEl.textContent = "";
            availableSpace = availableSpace - 1;
        }
    }

    function handleSubmitWord() {
        const currentWordArr = guessedWords[guessedWords.length - 1];

        if (currentWordArr.length !== 5) {
            alert("Word must be 5 letters");
            return;
        }

        const currentWord = currentWordArr.join("");
        
        // Basic animation & coloring logic
        const firstLetterId = wordIndex * 5 + 1;
        const interval = 200;
        
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                
                // Add the CSS class for color
                letterEl.classList.add("animate__animated", "animate__flipInX");
                letterEl.classList.add(tileColor);
                letterEl.style.backgroundColor = getComputedStyle(document.body).getPropertyValue(`--${tileColor}`);
            }, interval * index);
        });

        wordIndex += 1; // Move to next row

        if (currentWord === targetWord.toLowerCase()) {
            setTimeout(() => alert("Congratulations! You found the word!"), 1000);
        } else if (guessedWords.length === 6) {
            setTimeout(() => alert(`Game Over! The word was ${targetWord}`), 1000);
        }

        guessedWords.push([]);
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = targetWord.toLowerCase().includes(letter);

        if (!isCorrectLetter) {
            return "absent";
        }

        const letterInThatPosition = targetWord.toLowerCase().charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;

        if (isCorrectPosition) {
            return "correct";
        }
        return "present";
    }
});