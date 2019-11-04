//For next time! terminate/reset clock after turns and wins
// set up choice to play v human or computer
// set up computer AI 
//"smart choice"---> ingrain logic

let button = document.getElementById('start')
let status = document.getElementById('status')
let squares = Array.from(document.getElementsByClassName('square'))
let playerX = { name: 'X', moves: [], symbol: 'X' };
let playerO = { name: 'O', moves: [], symbol: 'O' };
let currentPlayer;
let wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let usedMoves = [];

status.textContent = 'Enter names, then press start'
button.addEventListener('click', gameStart)

function gameStart() {
    usedMoves = [];
    let playerOneName = document.getElementById("playerOne").value
    let playerTwoName = document.getElementById("playerTwo").value
    playerX = { name: playerOneName || 'Player X', moves: [], symbol: 'X' };
    playerO = { name: playerTwoName || 'Player O', moves: [], symbol: 'O', };
    squares.forEach((square) => {
        square.textContent = ""
    })
    currentPlayer = playerX;
    status.textContent = `${currentPlayer.name}'s Turn`
    button.disabled = true;
    gameplay();
}

function gameplay() {
    squares.forEach((square) => { square.addEventListener('click', select) })
}

function select() {

    let square = event.target;
    let i = squares.indexOf(square);
    if (squares.includes(square) && !usedMoves.includes(parseInt(square.id))) {
        square.textContent = currentPlayer.symbol;
        currentPlayer.moves.push(parseInt(squares.slice(i, i + 1)[0].id));
        usedMoves.push(parseInt(squares.slice(i, i + 1)[0].id));

        isWinner();
        changePlayer();
    } else if (usedMoves.includes(parseInt(square.id))) {
        status.textContent = `INVALID MOVE`;
        setTimeout(() => status.textContent = `${currentPlayer.name}'s Turn`, 1000)
    }
}

function changePlayer() {
    if (status.textContent === `${currentPlayer.name} WINS!!!`) {
        clock.innerText = "Clock"
    }
    else if (currentPlayer.name === playerX.name) {
        currentPlayer = playerO;
        status.textContent = `${currentPlayer.name}'s Turn`
    } else if (currentPlayer.name === playerO.name) {
        currentPlayer = playerX;
        status.textContent = `${currentPlayer.name}'s Turn`
    }
}

function isWinner() {
    wins.forEach((win) => {
        let arr = [];
        currentPlayer.moves.forEach((move) => {
            if (win.includes(move)) {
                arr.push(move);
            } if (arr.length === 3) {
                endGame();
            }
        })
    })
}

function endGame() {
    status.textContent = `${currentPlayer.name} WINS!!!`;
    squares.forEach((square) => { square.removeEventListener('click', select) })
    button.disabled = false;
}




//function randomSelect() {
//    let square = event.target;
//    let i = squares.indexOf(square);
//    if (squares.includes(square) && !usedMoves.includes(parseInt(square.id))) {
//        square.textContent = currentPlayer.symbol;
//        currentPlayer.moves.push(parseInt(squares.slice(i, i + 1)[0].id));
//        usedMoves.push(parseInt(squares.slice(i, i + 1)[0].id));
//
//        isWinner();
//        changePlayer();
//    }
//}
