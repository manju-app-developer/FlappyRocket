const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game Variables
let gravity = 0.5;
let rocket, obstacles, score, gameOver, velocity;

// Load Assets
const rocketImg = new Image();
rocketImg.src = "assets/rocket.png";

const asteroidImg = new Image();
asteroidImg.src = "assets/asteroid.png";

const jumpSound = new Audio("assets/jump.mp3");
const explosionSound = new Audio("assets/explosion.mp3");

// Rocket Object
class Rocket {
    constructor() {
        this.x = 100;
        this.y = canvas.height / 2;
        this.width = 50;
        this.height = 50;
        this.velocityY = 0;
    }

    draw() {
        ctx.drawImage(rocketImg, this.x, this.y, this.width, this.height);
    }

    update() {
        this.velocityY += gravity;
        this.y += this.velocityY;

        if (this.y + this.height >= canvas.height || this.y <= 0) {
            endGame();
        }
    }

    jump() {
        this.velocityY = -10;
        jumpSound.play();
    }
}

// Obstacle Object
class Obstacle {
    constructor() {
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - 100);
        this.width = 50;
        this.height = 100;
        this.speed = 5;
    }

    draw() {
        ctx.drawImage(asteroidImg, this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= this.speed;
        if (this.x + this.width < 0) {
            score++;
            obstacles.shift();
        }

        if (this.collidesWith(rocket)) {
            endGame();
        }
    }

    collidesWith(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}

// Initialize Game
function startGame() {
    rocket = new Rocket();
    obstacles = [];
    score = 0;
    gameOver = false;
    velocity = 0;

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") rocket.jump();
    });

    setInterval(() => {
        if (!gameOver) obstacles.push(new Obstacle());
    }, 1500);

    gameLoop();
}

// Game Loop
function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rocket.update();
    rocket.draw();

    obstacles.forEach((obstacle) => {
        obstacle.update();
        obstacle.draw();
    });

    document.getElementById("score").innerText = `Score: ${score}`;
    requestAnimationFrame(gameLoop);
}

// End Game
function endGame() {
    gameOver = true;
    explosionSound.play();
    alert(`Game Over! Final Score: ${score}`);
    location.reload();
}

startGame();
