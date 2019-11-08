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
        isWinner();
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
        randomSelect();
        currentPlayer = playerX;
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
    console.log(currentPlayer.name)
    wins.forEach((win) => {
        let arr = [];
        currentPlayer.moves.forEach((move) => {
            if (win.includes(move)) {
                arr.push(move);
            } if (arr.length === 3) {
                console.log(currentPlayer.name)
                status.textContent = `${currentPlayer.name} WINS!!!`;
                squares.forEach((square) => { square.removeEventListener('click', select) })
                button.disabled = false;
                clearInterval(timer);
                count = 0;

            } else if (usedMoves.length === 9) {
                draw();
            }
        })
    })
}

function draw() {
    status.textContent = `DRAW!`;
    clearInterval(timer);
    squares.forEach((square) => { square.removeEventListener('click', select) })
    button.disabled = false;
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

// AI selctor:  if player moves doesn't have 2 win choices in a win array, click a random box in an open win array.  
// if playerX DOES have 2 moves in a win array, pick the 3rd for that array.  DON'T USE FOREACH, use FOR LOOPS.  YOU CAN'T 
// USE 'return' or 'break' on a foreach method.  Make a function to determine if a blockable move is present by iterating 
//through possible win arrays and seeing if player x has 2 of them.  else, randomly pick.  

function isBlockable() { //2.0  
    for (win of wins) {
        let arr = [];
        for (move of usedMoves) {
            if (win.includes(move)) {
                arr.push(move)
            }
        } if (arr.length === 2) {
            return true;
        }
    } return false;
}



function randomSelect() {
    blockable();
    if (!blockable()) {
        currentPlayer = playerO;
        let squareArray = squares.map((square) => parseInt(square.id))
        let choices = squareArray.filter(
            function (e) {
                return this.indexOf(e) < 0;
            },
            usedMoves)
        let choiceIndex = Math.floor(Math.random() * (choices.length));
        let choice = choices[choiceIndex];
        console.log(squares[choice])
        squares[choice].click();
    } else if (blockable()) {
        block();
    }
}


function blockable() {
    currentPlayer = playerO;
    for (let i = 0; i < wins.length; i++) {
        let arr = [];
        for (let m = 0; m < playerX.moves.length; m++) {
            if (wins[i].includes(playerX.moves[m]) && !wins[i].includes(playerO.moves[m])) {
                arr.push(playerX.moves[m])
                for (y = 0; y < arr.length; y++) {
                    if (arr.length === 2 && !playerO.moves.includes(y) && !playerX.moves.includes(y)) {
                        return true;  //TROUBLE FINDING AN OPEN WIN ARRAY TO BLOCK
                    }
                }
            }
        }
    } return false;
}

function block() {
    currentPlayer = playerO;
    for (let i = 0; i < wins.length; i++) {
        let arr = [];
        for (let m = 0; m < playerX.moves.length; m++) {
            if (wins[i].includes(playerX.moves[m]) && !wins[i].includes(playerO.moves[m])) {
                arr.push(playerX.moves[m])
                if (arr.length === 2 && !arr.includes(playerO.moves[m])) {
                    let blocker = wins[i].filter(w => !arr.includes(w))
                    console.log(blocker)
                    return squares[blocker].click()
                }
            }
        }
    }
}