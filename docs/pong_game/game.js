const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 15;

const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;

// Paddle positions
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

// Ball position and velocity
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

// Score
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Prevent paddle from going off screen
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // 1. Background (Dark Teal)
    ctx.fillStyle = '#2A4759';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Net (Light Pink)
    ctx.strokeStyle = '#EEDBDB';
    ctx.lineWidth = 2; // Make net slightly thicker
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw Paddles (Sky Blue - The Complement)
    ctx.fillStyle = '#72CEF7';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // 4. Draw Ball (Your Orange)
    ctx.fillStyle = '#F79B72'; 
    ctx.beginPath();
    // Drawing a circle instead of a square for a cleaner look
    ctx.arc(ballX + BALL_SIZE/2, ballY + BALL_SIZE/2, BALL_SIZE/2, 0, Math.PI*2);
    ctx.fill();

    // 5. Draw Scores (Light Pink)
    ctx.font = 'bold 40px Arial'; // Slightly bolder font
    ctx.fillStyle = '#EEDBDB';
    ctx.fillText(playerScore, canvas.width * 0.25, 60);
    ctx.fillText(aiScore, canvas.width * 0.75, 60);
}

// Move ball and handle collisions
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision (top/bottom)
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Paddle collision (player)
    if (
        ballX <= PLAYER_X + PADDLE_WIDTH &&
        ballY + BALL_SIZE > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where the ball hit the paddle
        let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY += collidePoint * 0.15;
    }

    // Paddle collision (AI)
    if (
        ballX + BALL_SIZE >= AI_X &&
        ballY + BALL_SIZE > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballSpeedX = -ballSpeedX;
        let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY += collidePoint * 0.15;
    }

    // Left or right wall: score
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    // Randomize direction
    ballSpeedX = Math.random() > 0.5 ? 5 : -5;
    ballSpeedY = (Math.random() - 0.5) * 6;
}

// IMPROVED AI for right paddle
function updateAI() {
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ballY + BALL_SIZE / 2;

    // AI Speed (Increased from 5 to 8 for difficulty)
    let aiSpeed = 8; 

    // Dead zone (Reduced from 10 to 6 for better accuracy)
    if (aiCenter < ballCenter - 6) {
        aiY += aiSpeed;
    } else if (aiCenter > ballCenter + 6) {
        aiY -= aiSpeed;
    }

    // Prevent paddle from going off screen
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Main loop
function gameLoop() {
    updateBall();
    updateAI();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
gameLoop();