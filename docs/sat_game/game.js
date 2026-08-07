const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// --- CONFIGURATION ---
const GRAVITY = 0.25;
const FLAP_STRENGTH = -4.5;
const INITIAL_SPEED = 3;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 160; 

// --- COLORS ---
const COL_BG = '#2A4759';       // Dark Teal
const COL_SAT_BODY = '#F79B72'; // Orange
const COL_SAT_PANEL = '#EEDBDB';// Light Pink
const COL_TEXT = '#EEDBDB';

// --- ASSETS (Procedural) ---
const TYPE_METEOR = 0;
const TYPE_JUNK = 1;
const TYPE_ISS = 2;

// --- GAME STATE ---
let gameRunning = true;
let score = 0;
let frameCount = 0;
let currentSpeed = INITIAL_SPEED;
let highScores = []; // Array to hold top scores

// Stars Array
let stars = [];

// Satellite Object
let sat = {
    x: 50, y: 150, width: 20, height: 20, velocity: 0,
    rotation: 0 
};

// Debris Array
let debris = [];

// --- LEADERBOARD LOGIC ---
function loadHighScores() {
    const stored = localStorage.getItem('satFlapScores');
    if (stored) {
        highScores = JSON.parse(stored);
    } else {
        // Default empty leaderboard
        highScores = [
            { name: "UKSA", score: 50 },
            { name: "ESA", score: 40 },
            { name: "NASA", score: 30 },
            { name: "JAXA", score: 20 },
            { name: "NOOB", score: 10 }
        ];
    }
}

function saveHighScore(newScore) {
    // Check if score qualifies for top 5
    let lowestScore = highScores[highScores.length - 1].score;
    
    if (newScore > lowestScore) {
        // Simple delay to let the crash render first
        setTimeout(() => {
            let name = prompt("NEW HIGH SCORE! Enter your initials:", "AAA");
            if (!name) name = "ANON";
            
            // Limit name length
            name = name.substring(0, 10).toUpperCase();

            // Add new score
            highScores.push({ name: name, score: newScore });
            
            // Sort (High to Low)
            highScores.sort((a, b) => b.score - a.score);
            
            // Keep only top 5
            highScores = highScores.slice(0, 5);
            
            // Save to browser
            localStorage.setItem('satFlapScores', JSON.stringify(highScores));
        }, 100);
    }
}

// --- INITIALIZATION ---
function initStars() {
    stars = [];
    for(let i=0; i<100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random()
        });
    }
}

// --- INPUT ---
function flap() {
    if (gameRunning) {
        sat.velocity = FLAP_STRENGTH;
    } else {
        // Only restart if we are not currently processing a high score
        resetGame();
    }
}
window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') flap();
});
canvas.addEventListener('mousedown', flap);

// --- DRAWING HELPERS ---
function drawMeteor(x, y, w, h) {
    ctx.fillStyle = '#6D8291';
    ctx.beginPath();
    ctx.moveTo(x + w*0.2, y);
    ctx.lineTo(x + w*0.8, y);
    ctx.lineTo(x + w, y + h*0.3);
    ctx.lineTo(x + w*0.7, y + h);
    ctx.lineTo(x + w*0.2, y + h*0.9);
    ctx.lineTo(x, y + h*0.4);
    ctx.fill();
    ctx.fillStyle = '#526370';
    ctx.beginPath(); ctx.arc(x + w*0.4, y + h*0.3, w*0.15, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w*0.7, y + h*0.7, w*0.1, 0, Math.PI*2); ctx.fill();
}

function drawJunk(x, y, w, h) {
    ctx.fillStyle = '#72CEF7';
    ctx.fillRect(x + 10, y, w - 20, h);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 10); ctx.lineTo(x - 5, y + 20);
    ctx.moveTo(x + w - 10, y + h - 10); ctx.lineTo(x + w + 5, y + h - 5);
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(x + 15, y + 5, w - 30, 5);
}

function drawISS(x, y, w, h) {
    ctx.fillStyle = '#EEDBDB';
    let centerX = x + w/2;
    ctx.fillRect(centerX - 10, y, 20, h);
    ctx.fillStyle = '#F79B72';
    if(h > 40) {
        for(let i = y + 20; i < y + h - 20; i += 40) {
            ctx.fillRect(x - 10, i, 10, 30);
            ctx.fillRect(x + w, i, 10, 30);
            ctx.fillStyle = '#888';
            ctx.fillRect(x, i + 12, w, 6);
            ctx.fillStyle = '#F79B72';
        }
    }
}

// --- UPDATE ---
function update() {
    if (!gameRunning) return;

    // Difficulty Scaling
    let targetSpeed = INITIAL_SPEED + Math.floor(score / 5) * 0.5;
    if (targetSpeed > 8) targetSpeed = 8;
    currentSpeed = targetSpeed;

    // Physics
    sat.velocity += GRAVITY;
    sat.y += sat.velocity;
    sat.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (sat.velocity * 0.1)));

    // Collision: Floor/Ceiling
    if (sat.y + sat.height >= canvas.height || sat.y < 0) {
        gameOver();
    }

    // Spawn Obstacles
    frameCount++;
    if (frameCount % Math.floor(1000 / (currentSpeed * 60) * 10) === 0 || frameCount === 1) {
        let minHeight = 50;
        let maxHeight = canvas.height - OBSTACLE_GAP - minHeight;
        let topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        
        let rand = Math.random();
        let type = TYPE_METEOR; 
        if (rand > 0.90) type = TYPE_ISS;
        else if (rand > 0.6) type = TYPE_JUNK;

        debris.push({
            x: canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + OBSTACLE_GAP,
            width: OBSTACLE_WIDTH,
            type: type,
            passed: false
        });
    }

    // Move Debris
    for (let i = 0; i < debris.length; i++) {
        let d = debris[i];
        d.x -= currentSpeed;

        if (
            sat.x < d.x + d.width &&
            sat.x + sat.width > d.x &&
            (sat.y < d.topHeight || sat.y + sat.height > d.bottomY)
        ) {
            gameOver();
        }

        if (d.x + d.width < sat.x && !d.passed) {
            score++;
            d.passed = true;
        }
    }
    debris = debris.filter(d => d.x + d.width > 0);
}

function gameOver() {
    if(gameRunning) {
        gameRunning = false;
        saveHighScore(score);
    }
}

// --- DRAW ---
function draw() {
    // Background
    ctx.fillStyle = COL_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#FFF';
    stars.forEach(star => {
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
        ctx.fill();
        star.x -= currentSpeed * 0.1; 
        if(star.x < 0) star.x = canvas.width;
    });
    ctx.globalAlpha = 1.0;

    // Obstacles
    debris.forEach(d => {
        if (d.type === TYPE_METEOR) {
            drawMeteor(d.x, 0, d.width, d.topHeight);
            drawMeteor(d.x, d.bottomY, d.width, canvas.height - d.bottomY);
        } else if (d.type === TYPE_JUNK) {
            drawJunk(d.x, 0, d.width, d.topHeight);
            drawJunk(d.x, d.bottomY, d.width, canvas.height - d.bottomY);
        } else if (d.type === TYPE_ISS) {
            drawISS(d.x, 0, d.width, d.topHeight);
            drawISS(d.x, d.bottomY, d.width, canvas.height - d.bottomY);
        }
    });

    // Satellite
    ctx.save();
    ctx.translate(sat.x + sat.width/2, sat.y + sat.height/2);
    ctx.rotate(sat.rotation);
    ctx.fillStyle = COL_SAT_PANEL;
    ctx.fillRect(-20, -6, 40, 12);
    ctx.fillStyle = COL_SAT_BODY;
    ctx.fillRect(-10, -10, 20, 20);
    ctx.restore();

    // HUD
    ctx.fillStyle = COL_TEXT;
    ctx.font = 'bold 30px Arial';
    ctx.fillText("Score: " + score, 20, 50);

    // GAME OVER / LEADERBOARD SCREEN
    if (!gameRunning) {
        // Dark overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        
        // Title
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = COL_SAT_BODY;
        ctx.fillText("LEADERBOARD", canvas.width / 2, 80);

        // Score List
        ctx.font = '24px monospace'; // Monospace aligns text better
        ctx.fillStyle = '#fff';
        
        let startY = 140;
        highScores.forEach((entry, index) => {
            let rank = index + 1;
            let entryText = `${rank}. ${entry.name}`;
            // Add dots for alignment
            while(entryText.length < 15) entryText += "."; 
            entryText += ` ${entry.score}`;
            
            // Highlight current user score if it matches (optional flair)
            if(entry.score === score && index < 5) ctx.fillStyle = COL_DEBRIS;
            else ctx.fillStyle = '#fff';

            ctx.fillText(entryText, canvas.width / 2, startY + (index * 40));
        });

        // Retry Text
        ctx.fillStyle = COL_SAT_PANEL;
        ctx.font = 'bold 20px Arial';
        ctx.fillText("Click or Press Space to Retry", canvas.width / 2, canvas.height - 50);
        
        ctx.textAlign = 'left';
    }
}

// --- LOOP ---
function resetGame() {
    loadHighScores(); // Reload scores on reset
    sat.y = canvas.height / 2;
    sat.velocity = 0;
    sat.rotation = 0;
    debris = [];
    score = 0;
    currentSpeed = INITIAL_SPEED;
    frameCount = 0;
    gameRunning = true;
    initStars();
    loop();
}

function loop() {
    update();
    draw();
    if (gameRunning) requestAnimationFrame(loop);
}

// Start
loadHighScores(); // Load scores immediately on boot
initStars();
resetGame();