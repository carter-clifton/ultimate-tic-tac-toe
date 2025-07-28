//
// g_00 g_10 g_20
// g_10 g_11 g_21
// g_20 g_12 g_22
//

const g_00 = Array.from({ length: 3 }, () => new Array(3).fill(0));
const g_10 = Array.from({ length: 3 }, () => new Array(3).fill(0));
const g_20 = Array.from({ length: 3 }, () => new Array(3).fill(0));
const g_01 = Array.from({ length: 3 }, () => new Array(3).fill(0));
const g_11 = Array.from({ length: 3 }, () => new Array(3).fill(0));
const g_21 = Array.from({ length: 3 }, () => new Array(3).fill(0));
const g_02 = Array.from({ length: 3 }, () => new Array(3).fill(0));
const g_12 = Array.from({ length: 3 }, () => new Array(3).fill(0));
const g_22 = Array.from({ length: 3 }, () => new Array(3).fill(0));

let gameState = 0;

const games = [ g_00, g_01, g_02, g_10, g_11, g_12, g_20, g_21, g_22 ];

const gamesWon = Array.from({ length: 3 }, () => new Array(3).fill(0));

const board_size = 3;

const game_size = 3;

const board_container = document.getElementById("boardContainer");
const body = document.getElementById("body");

let lastMoveRow = null;
let lastMoveCol = null;

let player = "X"

function switchPlayer() {
    if (player == "X") {
        player = "Y";
        body.style.backgroundColor = "#AAAAFF"
    } else {
        player = "X";
        body.style.backgroundColor = "#FFAAAA"
    }
}

function generateBoards() {
    for (let i = 0; i < game_size; i++) {
        const game_row = document.createElement("div");
        game_row.classList += "gameRow";
        for (let j = 0; j < game_size; j++) {
            const game = document.createElement("div");
            game.classList += "game"
            game.id = "game" + j.toString() + i.toString();
            for (let k = 0; k < board_size; k++) {
                const board_row = document.createElement("div");
                board_row.classList += "boardRow";
                for (let l = 0; l < board_size; l++) {
                    const board_button = document.createElement("button");
                    board_button.classList += "boardButton";
                    board_button.classList += " g" + j.toString() + i.toString();
                    board_button.id = "b" + i.toString() + j.toString() + l.toString() + k.toString();
                    board_button.onclick = function(){getClick(i, j, k, l)};
                    board_row.appendChild(board_button);
                }
                game.appendChild(board_row);
            }
            game_row.appendChild(game);
        }
        board_container.appendChild(game_row);
    }
}

function checkMultipleEquality() {
    let arg_len = arguments.length;
    for (let i = 1; i < arg_len; i++) {
        if (arguments[i] != arguments[i - 1]) {
            return false;
        }
    }
    return true;
}

function checkIfBoardHasAnyFreeSpacesAvailable(m) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (m[i][j] == 0) {
                return true;
            }
        }
    }
    return false;
}

function checkForWin(board, p) {
    for (let row = 0; row < 3; row++) {
        if (checkMultipleEquality(board[row][0], board[row][1], board[row][2], p)) {
            return true;
        }
    }
    for (let column = 0; column < 3; column++) {
        if (checkMultipleEquality(board[0][column], board[1][column], board[2][column], p)) {
            return true;
        }
    }
    if (checkMultipleEquality(board[0][0], board[1][1], board[2][2], p)) {
        return true;
    }
    if (checkMultipleEquality(board[0][2], board[1][1], board[2][0], p)) {
        return true;
    }
    return false;
}

function setBoardToWin(i, j, p) {
    const buttonsInTheBoardThatWasWon = document.getElementsByClassName("g" + j.toString() + i.toString());
    for (let button = 0; button < buttonsInTheBoardThatWasWon.length; button++) {
        buttonsInTheBoardThatWasWon[button].classList.remove("playerX");
        buttonsInTheBoardThatWasWon[button].classList.remove("playerY");
        buttonsInTheBoardThatWasWon[button].classList.add("player" + p);
        buttonsInTheBoardThatWasWon[button].innerHTML = p;
    }
    gamesWon[i][j] = p;
}

function clearActiveThing() {
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            document.getElementById("game" + x.toString() + y.toString()).classList.remove("activeBoard")
        }
    }
}

function getClick(i, j, k, l) {
    if (gameState == 1) {
        return;
    }
    if (lastMoveCol != null) {
        if (i != lastMoveRow || j != lastMoveCol) {
            return;
        }
    }
    const b = document.getElementById("b" + i.toString() + j.toString() + l.toString() + k.toString());
    if (b.innerHTML != "") {
        return;
    }
    clearActiveThing();
    // const s = "Game(" + j + ", " + i + ") | Board(" + l + ", " + k + ")";
    // console.log(s);
    const game = 3 * i + j;
    games[game][k][l] = player;
    b.innerHTML = player;
    b.classList += " player" + player;
    if (checkForWin(games[game], player)) {
        console.log("WIN", game, player);
        setBoardToWin(i, j, player);
        if (checkForWin(gamesWon, player)) {
            gameState = 1;
            alert("PLAYER " + player + " HAS WON.");
        }
    }
    if (!checkIfBoardHasAnyFreeSpacesAvailable(games[3 * i + j]) && gamesWon[i][j] == 0) {
        gamesWon[i][j] = "Z";
    }
    if (!checkIfBoardHasAnyFreeSpacesAvailable(gamesWon) && gameState == 0) {
        alert("draw.");
        gameState = 1;
    }
    lastMoveRow = k;
    lastMoveCol = l;
    document.getElementById("game" + l.toString() + k.toString()).classList.add("activeBoard")
    if (gamesWon[k][l] != 0) {
        lastMoveRow = null;
        lastMoveCol = null;
        clearActiveThing();
    }
    switchPlayer();
    // printBoardState();
}

function printBoardState() {
    let s = `
    ${games[0][0][0]} ${games[0][0][1]} ${games[0][0][2]}   ${games[1][0][0]} ${games[1][0][1]} ${games[1][0][2]}   ${games[2][0][0]} ${games[2][0][1]} ${games[2][0][2]}
    ${games[0][1][0]} ${games[0][1][1]} ${games[0][1][2]}   ${games[1][1][0]} ${games[1][1][1]} ${games[1][1][2]}   ${games[2][1][0]} ${games[2][1][1]} ${games[2][1][2]}
    ${games[0][2][0]} ${games[0][2][1]} ${games[0][2][2]}   ${games[1][2][0]} ${games[1][2][1]} ${games[1][2][2]}   ${games[2][2][0]} ${games[2][2][1]} ${games[2][2][2]}

    ${games[3][0][0]} ${games[3][0][1]} ${games[3][0][2]}   ${games[4][0][0]} ${games[4][0][1]} ${games[4][0][2]}   ${games[5][0][0]} ${games[5][0][1]} ${games[5][0][2]}
    ${games[3][1][0]} ${games[3][1][1]} ${games[3][1][2]}   ${games[4][1][0]} ${games[4][1][1]} ${games[4][1][2]}   ${games[5][1][0]} ${games[5][1][1]} ${games[5][1][2]}
    ${games[3][2][0]} ${games[3][2][1]} ${games[3][2][2]}   ${games[4][2][0]} ${games[4][2][1]} ${games[4][2][2]}   ${games[5][2][0]} ${games[5][2][1]} ${games[5][2][2]}

    ${games[6][0][0]} ${games[6][0][1]} ${games[6][0][2]}   ${games[7][0][0]} ${games[7][0][1]} ${games[7][0][2]}   ${games[8][0][0]} ${games[8][0][1]} ${games[8][0][2]}
    ${games[6][1][0]} ${games[6][1][1]} ${games[6][1][2]}   ${games[7][1][0]} ${games[7][1][1]} ${games[7][1][2]}   ${games[8][1][0]} ${games[8][1][1]} ${games[8][1][2]}
    ${games[6][2][0]} ${games[6][2][1]} ${games[6][2][2]}   ${games[7][2][0]} ${games[7][2][1]} ${games[7][2][2]}   ${games[8][2][0]} ${games[8][2][1]} ${games[8][2][2]}
    `
    console.log(s);
}

generateBoards();