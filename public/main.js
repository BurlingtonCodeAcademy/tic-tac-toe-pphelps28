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
        changePlayer();
    } else if (usedMoves.includes(parseInt(square.id))) {
        status.textContent = `INVALID MOVE`;
        setTimeout(() => status.textContent = `${currentPlayer.name}'s Turn`, 1000)
    }
}

function changePlayer() {
    isWinner();
    if (status.textContent === `${currentPlayer.name} WINS!!!`) {
        clock.innerText = "Clock"
    }
    else if (currentPlayer.name === playerX.name && onePlayer.checked == true) {
        currentPlayer = playerO;;
        status.textContent = `${currentPlayer.name}'s Turn`
        randomSelect();
    } else if (currentPlayer.name === playerX.name) {
        currentPlayer = playerO;
        status.textContent = `${currentPlayer.name}'s Turn`
    } else if (currentPlayer.name === playerO.name) {
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


function randomSelect() {
    let squareArray = squares.map((square) => parseInt(square.id))
    let choices = squareArray.filter(
        function (e) {
            return this.indexOf(e) < 0;
        },
        usedMoves)
    for (let choice of choices) {
        for (win of wins) {
            if (win.includes(choice) && containsPlayerXMove(win).length === 0 && containsPlayerOMove(win).length === 2) {
                console.log('win move')
                return squares[choice].click();
            }
        }
    }
    for (choice of choices) {
        for (win of wins) {
            if (containsPlayerXMove(win).length === 2 && containsPlayerOMove(win).length === 0) {
                let blocker = win.filter(e => !playerX.moves.includes(e))
                console.log('blocker')
                return squares[blocker].click();
            }
        }
    }
    for (choice of choices) {
        for (win of wins) {
            if (choices.includes(4)) {
                console.log('center square')
                return squares[4].click();
            }
        }
    }
    for (let choice of choices) {
        let arr = [];
        for (win of wins) {
            if (win.includes(choice) && containsPlayerOMove(win).length == 0 && containsPlayerXMove(win).length > 0) {

                arr.push(win);
            }
        }
        if (arr.length >= 2) {
            console.log('best choice');
            arr = (arr.reduce((a, b) => a.concat(b)))
            let answer = findDuplicates(arr)
            return squares[answer[0]].click();
        }
    }
    if (!choices.includes(4) && choices.length > 0) {
        let corners = [0, 2, 6, 8]
        for (corner of corners) {
            if (!choices.includes(corner)) {
                let choice = choices[Math.floor(Math.random() * choices.length)]
                console.log('no corner')
                return squares[choice].click();
            }
        } let choice = corners[Math.floor(Math.random() * corners.length)]
        console.log('corner')
        return squares[choice].click()
    } else isWinner();
}

function findDuplicates(data) {
    let result = [];
    data.forEach(function (element, index) {
        // Find if there is a duplicate or not
        if (data.indexOf(element, index + 1) > -1) {
            // Find if the element is already in the result array or not
            if (result.indexOf(element) === -1) {
                result.push(element);
            }
        }
    });
    return result;
}