const board = document.getElementById("board");
let currentPlayer = "X";
let cells = Array(9).fill(null);
    
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
    }
}

renderBoard();