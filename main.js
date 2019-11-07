//"smart choice"---> ingrain logic

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
        isWinner();
        changePlayer();
        isWinner();
    } else if (usedMoves.includes(parseInt(square.id))) {
        status.textContent = `INVALID MOVE`;
        setTimeout(() => status.textContent = `${currentPlayer.name}'s Turn`, 1000)
    }
}

function changePlayer() {
    if (usedMoves.length === 9) {
        draw();

    }
    if (status.textContent === `${currentPlayer.name} WINS!!!`) {
        clock.innerText = "Clock"
    }
    else if (currentPlayer.name === playerX.name && onePlayer.checked == true) {
        currentPlayer = playerO;;
        randomSelect();
        isWinner();
        status.textContent = `${currentPlayer.name}'s Turn`
    } else if (currentPlayer.name === playerX.name) {
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

function draw() {
    status.textContent = `DRAW!`;
    isWinner();
    squares.forEach((square) => { square.removeEventListener('click', select) })
    button.disabled = false;
    clearInterval(timer);
    count = 0;
}

function endGame() {
    status.textContent = `${currentPlayer.name} WINS!!!`;
    squares.forEach((square) => { square.removeEventListener('click', select) })
    button.disabled = false;
    clearInterval(timer);
    count = 0;
}

function countUp() {
    count++
    clock.innerText = count
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
    isWinner();
}

////EXPERIMENTAL SECTION

function AISelect() {
    currentPlayer = playerO;
    let squareArray = squares.map((square) => parseInt(square.id))
    let choices = squareArray.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        usedMoves)
    console.log(choices) // all square #'s that are available
    //if choices include all 3 for a random win condition, choose 1 of those 3
    let winArray = findMoveSet();
    let winArrayChoice = winArray[Math.floor(Math.random() * 3)]
    winArrayChoice.click()


    //if the other player has 2 out of 3 for a win condition, choose the remaining one
    let choiceIndex = Math.floor(Math.random() * (choices.length));
    console.log(choiceIndex)
    let choice = choices[choiceIndex];
    console.log(choice);
    console.log(squares[choice])
    squares[choice].click();
    console.log(currentPlayer.name)
    isWinner();
}

function findBlock() {
    wins.forEach((win) => {
        let arr = [];
        currentPlayer.moves.forEach((move) => {
            if (win.includes(move)) {
                arr.push(move);
            } if (arr.length === 2) {
                endGame();
            }
        })
    })
}

function findMoveSet() {
    wins.forEach((win) => {
        let arr = [];
        choices.forEach((choice) => {
            if (win.includes(choice)) {
                arr.push(choice);
            } if (arr.length === 3) {
                return win;
            }
        })
    })
}
