const board = document.getElementById("board");
const goFirst = document.getElementById("go-first");
const goSecond = document.getElementById("go-second");

let currentPlayer = "X";
let humanPlayer = "X"; // By default
let aiPlayer = "O";
let isHumanTurn = true;
let cells = Array(9).fill(null);
   

goFirst.addEventListener("click", () => startGame(true));
goSecond.addEventListener("click", () => startGame(false));

function startGame(humanTurn) {
    if (!humanTurn) {
        humanPlayer = "O";
        aiPlayer = "X";
        isHumanTurn = false;
    }
    else {
        isHumanTurn = true;
    }
}

function renderBoard() {
    board.innerHTML = "";
    cells.forEach((cell, i) => {
        const btn = document.createElement("button");
        btn.textContent = cell || "";
        btn.onclick = () => makeMove(i);
        board.appendChild(btn);
    });
}

function makeMove(i) {
    if (!cells[i]) {
        cells[i] = currentPlayer;
        currentPlayer = currentPlayer == "X" ? "O" : "X";
        renderBoard();

        // if (!gameOver) {
        //     setTimeout(() => makeAIMove(), 1000);
        // }
    }
}

renderBoard();

// function makeAIMove() {
//     const AIMove = getBestMove(cells);
//     // cells[AIMove] = AIColor;
//     renderBoard();
// }