const board = document.getElementById("board");
const goFirst = document.getElementById("go-first");
const goSecond = document.getElementById("go-second");
const moveOrder = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // best to worst

let humanPlayer = "X"; // By default
let aiPlayer = "O";
let isHumanTurn = true;
let cells = Array(9).fill(null);

goFirst.addEventListener("click", () => startGame(true));
goSecond.addEventListener("click", () => startGame(false));

function startGame(humanTurn) {
    cells = Array(9).fill(null);
    humanPlayer = humanTurn ? "X" : "O";
    aiPlayer = humanTurn ? "O" : "X";
    isHumanTurn = humanTurn;

    renderBoard();

    if (!isHumanTurn) {
        makeAIMove();
    }
}

function renderBoard() {
    board.innerHTML = "";
    cells.forEach((cell, i) => {
        const btn = document.createElement("button");
        btn.textContent = cell || "";
        btn.disabled = !!cell || !isHumanTurn;
        btn.onclick = () => makeMove(i);
        board.appendChild(btn);
    });
}

function makeMove(i) {
    if (cells[i] || !isHumanTurn) return;
    
    cells[i] = humanPlayer;
    isHumanTurn = !isHumanTurn;
    renderBoard();

    // if (!isGameOver) {
    //     setTimeout(() => makeAIMove(), 1000);
    // }
    if (!isGameOver(cells)) {
        makeAIMove();
    }
}

function makeAIMove() {
    const AIMove = getBestMove(cells, aiPlayer, isHumanTurn);
    if (AIMove != -1) {
        cells[AIMove] = aiPlayer;
    }

    isHumanTurn = !isHumanTurn;
    renderBoard();
}

function getBestMove(cells, aiPlayer, isHumanTurn) {
    let bestValue = -Infinity;
    let bestMove = -1;

    for (let i of moveOrder) {
        if (!cells[i]) {
            cells[i] = aiPlayer;

            let value = minimaxAlphaBeta(cells, -Infinity, Infinity, 9, aiPlayer == "X" ? "O" : "X", false);
            if (value > bestValue) {
                bestValue = value;
                bestMove = i;
            }

            cells[i] = null;
        }
    }

    return bestMove;
}

function minimaxAlphaBeta(cells, alpha, beta, depth, player, maxPlayer) {
    if (isGameOver(cells) || depth == 0) {
        return getHeuristic(cells, player);
    }

    let value = maxPlayer ? -Infinity : Infinity;

    for (let i of moveOrder) {
        if (!cells[i]) {
            // let cellsAux = cells;
            // cellsAux[i] = player;

            cells[i] = player;

            if (maxPlayer) {
                value = Math.max(value, minimaxAlphaBeta(cells, alpha, beta, depth - 1, player == "X" ? "O" : "X", !maxPlayer));
                alpha = Math.max(alpha, value);
            }
            else {
                value = Math.min(value, minimaxAlphaBeta(cells, alpha, beta, depth - 1, player == "X" ? "O" : "X", !maxPlayer));
                beta = Math.min(beta, value);
            }

            cells[i] = null;

            if (beta <= alpha) {
                break;
            }
        }
    }

    return value;
}

function getHeuristic(cells, player) {
    const opponent = player === "X" ? "O" : "X";
    const weights = {0:0, 1:1, 2:10};

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    let score = 0;

    for (const line of winConditions) {
        const a = cells[line[0]], b = cells[line[1]], c = cells[line[2]];

        if (a === player && b === player && c === player) return Infinity;
        if (a === opponent && b === opponent && c === opponent) return -Infinity;

        let playerScore =
            (a === player) + (b === player) + (c === player);
        let opponentScore =
            (a === opponent) + (b === opponent) + (c === opponent);

        if (playerScore > 0 && opponentScore === 0) score += weights[playerScore];
        else if (opponentScore > 0 && playerScore === 0) score -= weights[opponentScore];
    }

    return score;
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