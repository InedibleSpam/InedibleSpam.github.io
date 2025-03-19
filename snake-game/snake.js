var blockSize = 25;
var rows = 20;
var cols = 20;
var board;
var context;
var eatSound = new Audio("eat.mp3");
var gameOverSound = new Audio("gameOver.mp3");
var snakeColor = "#00FF00";
var eatSlowSound = new Audio("eatSlow.mp3");
var eatFastSound = new Audio("eatFast.mp3");
const eatingAudio = ['eat.mp3','eatSlow.mp3','eatFast.mp3'];

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;
var velocityX = 0;
var velocityY = 0;
var snakeBody = [];
var foodX, foodY;
var gameOver = false;
var score = 0;
var highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").innerText = "High Score: " + highScore;
var gameInterval;

function playRandomAudio() {
    const randomSound = Math.floor(Math.random()*eatingAudio.length);
    const eating = new Audio(eatingAudio[randomSound]);
    eating.play();
}

window.onload = function () {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d");
    
    placeFood();
    document.addEventListener("keydown", changeDirection);
    document.getElementById("startBtn").addEventListener("click", startGame);
};

function startGame() {
    gameOver = false;
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    document.getElementById("score").innerText = "Score: 0";
    document.getElementById("highScore").innerText = "High Score: " + highScore;
    placeFood();
    clearInterval(gameInterval);
    var speed = Math.max(100-score*5, 50);
    gameInterval = setInterval(update, speed);
    gameOverSound.currentTime=0;
    gameOverSound.pause();
    
}

function update() {
    if (gameOver) return;
    context.fillStyle = "#000";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.beginPath();
    context.arc(foodX + blockSize / 2, foodY + blockSize / 2, blockSize / 2, 0, 2 * Math.PI);
    context.fill();

    context.strokeStyle = "#333"; 
    context.lineWidth = 1;

    for (let i = 0; i < cols; i++) {
        context.beginPath();
        context.moveTo(i * blockSize, 0);
        context.lineTo(i * blockSize, board.height);
        context.stroke();
    }

    for (let j = 0; j < rows; j++) {
        context.beginPath();
        context.moveTo(0, j * blockSize);
        context.lineTo(board.width, j * blockSize);
        context.stroke();
    }

    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score++;
        document.getElementById("score").innerText = "Score: " + score;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    
    context.fillStyle = "lime";
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    
    if (snakeX < 0 || snakeX >= cols * blockSize || snakeY < 0 || snakeY >= rows * blockSize) {
        endGame();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            endGame();
        }
    }
    if (snakeX === foodX && snakeY === foodY) {
        playRandomAudio();
    }
}

function changeDirection(e) {
    if (e.code === "ArrowUp" && velocityY === 0) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.code === "ArrowDown" && velocityY === 0) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.code === "ArrowLeft" && velocityX === 0) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.code === "ArrowRight" && velocityX === 0) {
        velocityX = 1;
        velocityY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    gameOverSound.play();
    

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("highScore").innerText = "High Score: " + highScore;
    }
    alert("Game Over! Final Score: " + score);
}
