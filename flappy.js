
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = {
    x: 150,
    y: 200,
    width: 68,
    height: 48,
    gravity: 0.3,
    lift: -4,
    velocity: 0
};

let pipes = [];
let gameStarted = false;
let gameOver = false;
let score = 0;
let pipeGap = 260;
let pipeSpeed = 2;
let countdown = 3;

const birdImg = new Image();
birdImg.src = 'https://via.placeholder.com/68x48';

function startGame(difficulty) {
    document.getElementById('start-screen').style.display = 'none';
    canvas.style.display = 'block';
    switch(difficulty) {
        case 'easy':
            pipeGap = 260;
            pipeSpeed = 2;
            break;
        case 'hard':
            pipeGap = 195;
            pipeSpeed = 3;
            break;
        case 'advanced':
            pipeGap = 130;
            pipeSpeed = 4;
            break;
    }
    gameStarted = true;
    gameLoop();
}

function gameLoop() {
    if (gameOver) {
        ctx.font = '48px serif';
        ctx.fillText('Game Over', 300, 300);
        return;
    }

    if (countdown > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px serif';
        ctx.fillText(countdown, 380, 300);
        countdown--;
        setTimeout(gameLoop, 1000);
        return;
    }

    update();
    draw();

    requestAnimationFrame(gameLoop);
}

function update() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < 600) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            y: pipeHeight,
            width: 50,
            height: pipeHeight,
            passed: false
        });
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;

        if (!pipes[i].passed && pipes[i].x < bird.x) {
            score++;
            pipes[i].passed = true;
        }

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
            i--;
        }

        if (
            bird.x < pipes[i].x + pipes[i].width &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].height || bird.y + bird.height > pipes[i].height + pipeGap)
        ) {
            gameOver = true;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    for (let i = 0; i < pipes.length; i++) {
        let gradient = ctx.createLinearGradient(pipes[i].x, 0, pipes[i].x + pipes[i].width, 0);
        gradient.addColorStop(0, 'darkgreen');
        gradient.addColorStop(1, 'lightgreen');

        ctx.fillStyle = gradient;
        ctx.fillRect(pipes[i].x, 0, pipes[i].width, pipes[i].height);
        ctx.fillRect(pipes[i].x, pipes[i].height + pipeGap, pipes[i].width, canvas.height);
    }

    ctx.font = '24px serif';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !gameOver) {
        bird.velocity = bird.lift;
    }
});
