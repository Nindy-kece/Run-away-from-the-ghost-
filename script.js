const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreEl = document.getElementById('score');

let isJumping = false;
let jumpHeight = 0;
let gravity = 2;
let jumpSpeed = 0;
let score = 0;
let obstacles = [];
let gameOver = false;
let isStarted = false;

// start screen & start button
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const gameTips = document.getElementById('game-tips');

function jump() {
    if (!isJumping && !gameOver && isStarted) {
        isJumping = true;
        jumpSpeed = 18;
    }
}

function update() {
    if (!gameOver && isStarted) {
        // Handle jumping
        if (isJumping) {
            jumpHeight += jumpSpeed;
            jumpSpeed -= gravity;
            if (jumpHeight <= 0) {
                jumpHeight = 0;
                isJumping = false;
            }
        }
        // Update pixel pancake pos
        player.style.bottom = (20 + jumpHeight) + 'px';

        // Rintangan update
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            obs.x -= 6;
            obs.el.style.left = obs.x + 'px';

            // Detect collission pixel
            if (
                obs.x < 82 && obs.x + obs.width > 54 &&
                jumpHeight < 22 // cukup rendah dianggap nabrak!
            ) {
                endGame();
                return;
            }

            // If gone off screen
            if (obs.x + obs.width < 0) {
                gameContainer.removeChild(obs.el);
                obstacles.splice(i, 1);
                score++;
                scoreEl.textContent = 'Skor: ' + score;
            }
        }
    }
    requestAnimationFrame(update);
}

function spawnObstacle() {
    if (gameOver || !isStarted) return;

    const obstacle = document.createElement('div');
    obstacle.className = 'obstacle';
    // Size random pixel block
    let width = 21 + Math.floor(Math.random()*5);

    obstacle.style.width = width+"px";
    // Eyes (pixel)
    const eyes = document.createElement('div');
    eyes.className = "eyes";
    obstacle.appendChild(eyes);
    // Mouth pixel
    const mouth = document.createElement('div');
    mouth.className = "mouth";
    obstacle.appendChild(mouth);

    obstacle.style.left = (gameContainer.offsetWidth) + 'px';
    gameContainer.appendChild(obstacle);

    obstacles.push({
        el: obstacle,
        x: gameContainer.offsetWidth,
        width: width
    });

    let interval = 1000 + Math.random() * 900;
    setTimeout(spawnObstacle, interval);
}

function endGame() {
    gameOver = true;
    setTimeout(() => {
        alert('Pancake ketabrak setan pixel!\nSkor anda: ' + score + '\nKlik OK untuk ulang.');
        location.reload();
    }, 40);
}

// KONTROL
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        jump();
        e.preventDefault();
    }
});
gameContainer.addEventListener('click', jump);

// START - via tombol
startBtn.onclick = function() {
    startScreen.style.display = 'none';
    gameContainer.style.display = '';
    scoreEl.style.display = '';
    gameTips.style.display = '';
    isStarted = true;

    score = 0;
    scoreEl.textContent = 'Skor: ' + score;
    obstacles = [];
    gameOver = false;

    update(); // Start loop
    setTimeout(spawnObstacle, 1300);
};

// Jalan loop render dari awal supaya responsive
update();
