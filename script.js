const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const messageText = document.getElementById('messageText');
const messageContainer = document.getElementById('message');
const restartButton = document.getElementById('restartBtn');
const container = document.querySelector('.container');

let currentPlayer;
let gameActive;

startGame();

function startGame() {
    currentPlayer = X_CLASS;
    gameActive = true;
    cells.forEach(cell => {
        cell.innerText = ''; 
        cell.className = cell.className.replace(/x|o/g, '').trim(); 
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    messageText.innerText = '';
    hideMessage();
    removeBlur();
    document.removeEventListener('click', handleDocumentClick);
}

function handleClick(e) {
    const cell = e.target;
    if (!gameActive) return;
    placeMark(cell, currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function placeMark(cell, currentClass) {
    cell.setAttribute('data-content', currentClass === X_CLASS ? 'X' : 'O');
    cell.classList.add(currentClass);
}

function swapTurns() {
    currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    board.classList.add(currentPlayer);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    if (draw) {
        showMessage('Draw!');
    } else {
        showMessage(`${currentPlayer === X_CLASS ? "X" : "O"} wins!`);
    }
    gameActive = false;
    setTimeout(() => {
        document.addEventListener('click', handleDocumentClick);
    }, 100);
}

function showMessage(message) {
    messageText.innerText = message;
    messageContainer.classList.add('show-message');
    addBlur();
}

function hideMessage() {
    messageContainer.classList.remove('show-message');
}

function addBlur() {
    container.classList.add('blur-background');
}

function removeBlur() {
    container.classList.remove('blur-background');
}

function handleDocumentClick(e) {
    if (messageContainer.classList.contains('show-message')) {
        startGame();
    }
}

restartButton.addEventListener('click', startGame);
