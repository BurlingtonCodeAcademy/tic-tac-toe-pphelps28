let button = document.getElementById('start')
let status = document.getElementById('status')
let squares = Array.from(document.getElementsByClassName('square'))
let playerX = { name: 'X', moves: [], symbol: 'X' };
let playerO = { name: 'O', moves: [], symbol: 'O' };
let currentPlayer;
let wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let usedMoves = [];
let timer;
let count = 0
let onePlayer = document.getElementById("chooseOne")
status.textContent = 'Enter names, then press start'
button.addEventListener('click', gameStart)

function gameStart() {
    usedMoves = [];
    let playerOneName = document.getElementById("playerOne").value
    let playerTwoName = document.getElementById("playerTwo").value
    playerX = { name: playerOneName || 'Player X', moves: [], symbol: 'X' };
    playerO = { name: playerTwoName || 'Player O', moves: [], symbol: 'O' };
    squares.forEach((square) => {
        square.textContent = ""
    })
    currentPlayer = playerX;
    status.textContent = `${currentPlayer.name}'s Turn`
    button.disabled = true;
    gameplay();
}

function gameplay() {
    timer = setInterval(countUp, 1000)
    squares.forEach((square) => { square.addEventListener('click', select) })
}

function select() {
    let square = event.target;
    let i = squares.indexOf(square);
    if (squares.includes(square) && !usedMoves.includes(parseInt(square.id))) {
        square.textContent = currentPlayer.symbol;
        currentPlayer.moves.push(parseInt(squares.slice(i, i + 1)[0].id));
        usedMoves.push(parseInt(squares.slice(i, i + 1)[0].id));
        changePlayer();// DON'T CALL AFTER WINNER IS DETERMINED
    } else if (usedMoves.includes(parseInt(square.id))) {
        status.textContent = `INVALID MOVE`;
        setTimeout(() => status.textContent = `${currentPlayer.name}'s Turn`, 1000)
    }
}

function changePlayer() {
    if (status.textContent === `${currentPlayer.name} WINS!!!`) {
        clock.innerText = "Clock"
    }
    else if (currentPlayer.name === playerX.name && onePlayer.checked == true) {
        currentPlayer = playerO;;
        console.log(isBlockable())
        status.textContent = `${currentPlayer.name}'s Turn`
        choiceAI();
    } else if (currentPlayer.name === playerX.name) {
        currentPlayer = playerO;
        status.textContent = `${currentPlayer.name}'s Turn`
    } else if (currentPlayer.name === playerO.name) {
        console.log(currentPlayer.name)
        currentPlayer = playerX;
        status.textContent = `${currentPlayer.name}'s Turn`
    } isWinner();
}


function isWinner() {
    for (win of wins) {
        if (containsPlayerOMove(win).length === 3) {
            endGame(playerO)
        } else if (containsPlayerXMove(win).length === 3) {
            endGame(playerX)
        } else if (usedMoves.length === 9) {
            draw();
        }
    }
}

function draw() {
    status.textContent = `DRAW!`;
    clearInterval(timer);
    squares.forEach((square) => { square.removeEventListener('click', select) })
    button.disabled = false;
    count = 0;
}

function endGame(player) {
    status.textContent = `${player.name} WINS!!!`;
    squares.forEach((square) => { square.removeEventListener('click', select) })
    button.disabled = false;
    clearInterval(timer);
    count = 0;
}

function countUp() {
    count++
    clock.innerText = count
}

function isBlockable() {
    for (win of wins) {
        console.log(containsPlayerXMove(win))
        console.log(containsPlayerOMove(win))
        if (containsPlayerXMove(win).length === 2 && containsPlayerOMove(win).length === 0) {
            return win;
        }
    } return false;
}
function containsPlayerXMove(arr) {
    let retArr = [];
    for (move of playerX.moves) {
        if (arr.includes(move)) {
            retArr.push(move);
        }
    } return retArr;
}
function containsPlayerOMove(arr) {
    let retArr = [];
    for (move of playerO.moves) {
        if (arr.includes(move)) {
            retArr.push(move);
        }
    } return retArr; R
}


function choiceAI() {
    if (isBlockable()) {
        console.log(isBlockable())
        let blocker = isBlockable().filter(e => !playerX.moves.includes(e))
        console.log(blocker)
        squares[blocker].click();
        currentPlayer = playerX;
    } else if (!isBlockable() && usedMoves.length !== 9) {
        randomSelect()
        currentPlayer = playerX;
    } else isWinner();
}
function choices() {
    let squareArray = squares.map((square) => parseInt(square.id))
    let choices = squareArray.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        usedMoves)
    return choices;
}
function randomSelect() {
    currentPlayer = playerO;
    let squareArray = squares.map((square) => parseInt(square.id))
    let choices = squareArray.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        usedMoves)
    let choiceIndex = Math.floor(Math.random() * (choices.length));
    let choice = choices[choiceIndex];
    squares[choice].click();
}