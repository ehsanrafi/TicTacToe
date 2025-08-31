function getHeuristic(cells, player) {
    const opponent = player === "X" ? "O" : "X";
    const weights = { 0: 0, 1: 1, 2: 10 };

    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
        [0, 4, 8], [2, 4, 6] // diagonal
    ];

    let score = 0;

    for (const line of winConditions) {
        const a = cells[line[0]], b = cells[line[1]], c = cells[line[2]];

        // If a player wins, return infinity or negative infinity
        if (a === player && b === player && c === player) return Infinity;
        if (a === opponent && b === opponent && c === opponent) return -Infinity;

        // Count the player's and opponent's pieces in this line
        let playerScore = (a === player) + (b === player) + (c === player);
        let opponentScore = (a === opponent) + (b === opponent) + (c === opponent);

        // Score for lines where only the player or only the opponent has pieces
        score += weights[playerScore] - weights[opponentScore];
    }

    return score;
}

// Example usage
const board = ["X", "X", "X", "O", "X", " ", "O", " ", " "];
const player = "X";

const heuristicScore = getHeuristic(board, player);
console.log(`Heuristic score for player ${player}:`, heuristicScore);
