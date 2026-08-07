const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// --- CONFIGURATION ---
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const SPEED = 5;
const GROUND_HEIGHT = 50; // Distance from bottom

// --- COLORS (Your Palette) ---
const COL_BG = '#2A4759';       // Dark Teal
const COL_DINO = '#F79B72';     // Orange
const COL_OBSTACLE = '#72CEF7'; // Sky Blue
const COL_ACCENT = '#EEDBDB';   // Light Pink (Ground/Text)

// --- GAME STATE ---
let gameRunning = true;
let score = 0;
let frameCount = 0;

// Dino Object
let dino = {
    x: 50,
    y: 0,
    width: 30,
    height: 30,
    dy: 0, // Vertical velocity
    grounded: false
};

// Obstacles Array
let obstacles = [];

// --- INPUT HANDLER ---
// Supports Spacebar, Up Arrow, or Mouse Click
function jump() {
    if (dino.grounded && gameRunning) {
        dino.dy = JUMP_STRENGTH;
        dino.grounded = false;
    } else if (!gameRunning) {
        resetGame();
    }
}

window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') jump();
});
canvas.addEventListener('mousedown', jump);

// --- UPDATE LOGIC ---
function update() {
    if (!gameRunning) return;

    // 1. DINO PHYSICS
    dino.dy += GRAVITY; // Apply gravity
    dino.y += dino.dy;  // Apply velocity to position

    // Ground Collision
    let groundY = canvas.height - GROUND_HEIGHT - dino.height;
    if (dino.y >= groundY) {
        dino.y = groundY;
        dino.dy = 0;
        dino.grounded = true;
    }

    // 2. OBSTACLE MANAGEMENT
    frameCount++;
    
    // Spawn obstacle every 90-140 frames randomly
    if (frameCount % Math.floor(Math.random() * 50 + 90) === 0) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - GROUND_HEIGHT - 30, // On the ground
            width: 20,
            height: 30 + Math.random() * 20, // Random height
            passed: false
        });
    }

    // Move obstacles
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.x -= SPEED;

        // Collision Detection
        if (
            dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            dino.y < obs.y + obs.height &&
            dino.y + dino.height > obs.y
        ) {
            gameRunning = false; // Game Over
        }

        // Score counting
        if (obs.x + obs.width < dino.x && !obs.passed) {
            score++;
            obs.passed = true;
        }
    }

    // Remove off-screen obstacles to keep game fast
    obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
}

// --- DRAW LOGIC ---
function draw() {
    // 1. Background
    ctx.fillStyle = COL_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Ground Line
    ctx.fillStyle = COL_ACCENT;
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, 2);

    // 3. Dino
    ctx.fillStyle = COL_DINO;
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // 4. Obstacles
    ctx.fillStyle = COL_OBSTACLE;
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // 5. Score / Game Over Text
    ctx.fillStyle = COL_ACCENT;
    ctx.font = '24px Arial';
    ctx.fillText("Score: " + score, 20, 40);

    if (!gameRunning) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText("Press Space or Click to Restart", canvas.width / 2, canvas.height / 2 + 20);
        ctx.textAlign = 'left'; // Reset alignment
    }
}

// --- RESET ---
function resetGame() {
    dino.y = canvas.height - GROUND_HEIGHT - dino.height;
    dino.dy = 0;
    obstacles = [];
    score = 0;
    frameCount = 0;
    gameRunning = true;
    loop();
}

// --- LOOP ---
function loop() {
    update();
    draw();
    if (gameRunning) {
        requestAnimationFrame(loop);
    }
}

// Start
resetGame();