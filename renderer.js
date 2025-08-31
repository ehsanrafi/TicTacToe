const board = document.getElementById("board");
const goFirst = document.getElementById("go-first");
const goSecond = document.getElementById("go-second");
const ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // best to worst

let humanPlayer = "X"; // by default
let aiPlayer = "O";
let isHumanTurn = true;
let cells = Array(9).fill(null);
let gameActive = true;

goFirst.addEventListener("click", () => startGame(true));
goSecond.addEventListener("click", () => startGame(false));

function renderBoard() {
    board.innerHTML = "";
    cells.forEach((cell, i) => {
        const btn = document.createElement("button");
        btn.textContent = cell || "";
        btn.disabled = !!cell || !isHumanTurn || !gameActive;
        btn.onclick = () => makeMove(i);
        board.appendChild(btn);
    });
}

function startGame(humanTurn) {
    cells = Array(9).fill(null);
    humanPlayer = humanTurn ? "X" : "O";
    aiPlayer = humanTurn ? "O" : "X";
    isHumanTurn = humanTurn;
    gameActive = true;

    renderBoard();

    if (!isHumanTurn) {
        makeAIMove();
    }
}

function makeMove(i) {
    if (cells[i] || !isHumanTurn || !gameActive) return;
    
    cells[i] = humanPlayer;
    isHumanTurn = !isHumanTurn;
    renderBoard();

    if (isGameOver(cells)) {
        gameActive = false;
    } else {
        makeAIMove();
    }
}

function makeAIMove() {
    if (!gameActive) return;

    const AIMove = getBestMove(cells, aiPlayer);
    if (AIMove != -1) {
        cells[AIMove] = aiPlayer;
    }
    else {
        alert("Error!");
    }

    isHumanTurn = !isHumanTurn;
    renderBoard();

    if (isGameOver(cells)) {
        gameActive = false;
    }
}

function getBestMove(cells, aiPlayer) {
    let bestValue = -Infinity;
    let bestMove = -1;

    for (let i of ORDER) {
        if (!cells[i]) {
            cells[i] = aiPlayer;

            let value = minimaxAlphaBeta(cells, -Infinity, Infinity, 9, aiPlayer, false);
            cells[i] = null;
            
            if (value > bestValue) {
                bestValue = value;
                bestMove = i;
            }

        }
    }

    return bestMove;
}

function minimaxAlphaBeta(cells, alpha, beta, depth, player, maxPlayer) {
    if (isGameOver(cells) || depth == 0) {
        return getHeuristic(cells, aiPlayer, depth);
    }

    const currentPlayer = maxPlayer ? aiPlayer : (aiPlayer === "X" ? "O" : "X");
    let value = maxPlayer ? -Infinity : Infinity;

    for (let i of ORDER) {
        if (!cells[i]) {
            cells[i] = currentPlayer;
            
            if (maxPlayer) {
                value = Math.max(value, minimaxAlphaBeta(cells, alpha, beta, depth - 1, aiPlayer, false));
                cells[i] = null;
                alpha = Math.max(alpha, value);
            }
            else {
                value = Math.min(value, minimaxAlphaBeta(cells, alpha, beta, depth - 1, aiPlayer, true));
                cells[i] = null;
                beta = Math.min(beta, value);
            }

            if (beta <= alpha) {
                break;
            }
        }
    }

    return value;
}

function getHeuristic(cells, player, depth) {
    const opponent = player === "X" ? "O" : "X";

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
        [0, 4, 8], [2, 4, 6] // diagonal
    ];

    for (const line of winConditions) {
        const a = cells[line[0]], b = cells[line[1]], c = cells[line[2]];

        if (a === player && b === player && c === player) return 1000 + depth;
        if (a === opponent && b === opponent && c === opponent) return -1000 - depth;
    }

    return 0;
}

function isGameOver(cells) {
    for (let i = 0; i < 3; i++) {
        // check row
        if (cells[i * 3] == cells[i * 3 + 1] && cells[i * 3] == cells[i * 3 + 2] && cells[i * 3] != null) {
            // return cells[i * 3];
            return true;
        }

        // check column
        if (cells[i] == cells[i + 3] && cells[i] == cells[i + 6] && cells[i] != null) {
            // return cells[i];
            return true;
        }
    }
    
    // check diagonals
    if (cells[0] == cells[4] && cells[0] == cells[8] && cells[0] != null) {
        // return cells[0];
        return true;
    }
    
    if (cells[2] == cells[4] && cells[2] == cells[6] && cells[2] != null) {
        // return cells[2];
        return true;
    }

    // check void
    if (cells.includes(null)) {
        return false;
    }

    return true;
}