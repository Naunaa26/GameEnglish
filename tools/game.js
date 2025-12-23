const ROWS = 15;
const COLS = 19;
const BOMB_TIMER = 2500;
const EXPLOSION_DURATION = 500;
const INITIAL_SPEED = 6;
const DISPLAY_INITIAL_SPEED = 1;
const AI_MOVE_INTERVAL = 1000;


const ENEMY_TYPES = [
    { type: 'wolf', icon: '🐺', penalty: 1, color: '#DC143C' },     
    { type: 'bear', icon: '🐯', penalty: 2, color: '#8B4513' },     
    { type: 'tiger', icon: '🦁', penalty: 3, color: '#FF6347' }     
];

const ENEMY_SPEED = {
    wolf: 1,
    bear: 1.2,
    tiger: 0.7
};

let gameBoard = [];
let bombs = [];
let explosions = [];
let enemies = [];
let powerUps = [];

let gameRunning = true;
let gameTimer = 300;
let timerInterval = null;

let playerInput = { p1: null, p2: null };
let lastMoveTime = { p1: 0, p2: 0 };

let isAnswering = false;
let backgroundMusic = null;

let players = [
    {
        id: 'p1',
        x: 0, y: 0,
        lives: 3,
        bombs: 1,
        bombRange: 2,
        speed: INITIAL_SPEED,
        displaySpeed: DISPLAY_INITIAL_SPEED
    },
    {
        id: 'p2',
        x: COLS - 1, y: ROWS - 1,
        lives: 3,
        bombs: 1,
        bombRange: 2,
        speed: INITIAL_SPEED,
        displaySpeed: DISPLAY_INITIAL_SPEED
    }
];

const board = document.getElementById('game-board');
const timer = document.querySelector('.timer-text');
const lives1 = document.querySelector('.player-card.p1 .lives');
const lives2 = document.querySelector('.player-card.p2 .lives');
const questionOverlay = document.getElementById('question-overlay');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const gameOverOverlay = document.getElementById('game-over-overlay');
const gameOverText = document.getElementById('game-over-text');
const finalScoreDisplay = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');
const effectPopupsContainer = document.getElementById('effect-popups');


const p1BombsEl = document.getElementById('p1-bombs');
const p1RangeEl = document.getElementById('p1-range');
const p1SpeedEl = document.getElementById('p1-speed');
const p2BombsEl = document.getElementById('p2-bombs');
const p2RangeEl = document.getElementById('p2-range');
const p2SpeedEl = document.getElementById('p2-speed');

function createBackgroundParticles() {
    const container = document.getElementById('bg-particles');
    if (!container) return;
    
    container.innerHTML = '';
    
    const leafEmojis = ['🍂', '🍃', '🌿'];
    for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf-particle';
        leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.animationDuration = (Math.random() * 10 + 10) + 's';
        leaf.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(leaf);
    }
    
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particle.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(particle);
    }
}

function initGame() {
    bombs = []; explosions = []; enemies = []; powerUps = [];
    gameRunning = true;
    gameTimer = 300;
    timerInterval = null;
    playerInput = { p1: null, p2: null };
    lastMoveTime = { p1: 0, p2: 0 };
    isAnswering = false;

    players[0].x = 0; players[0].y = 0; players[0].lives = 3; players[0].bombs = 1; players[0].bombRange = 2; players[0].speed = INITIAL_SPEED; players[0].displaySpeed = DISPLAY_INITIAL_SPEED;
    players[1].x = COLS - 1; players[1].y = ROWS - 1; players[1].lives = 3; players[1].bombs = 1; players[1].bombRange = 2; players[1].speed = INITIAL_SPEED; players[1].displaySpeed = DISPLAY_INITIAL_SPEED;

    gameBoard = [];
    for (let y = 0; y < ROWS; y++) {
        gameBoard[y] = [];
        for (let x = 0; x < COLS; x++) {
            if (x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1 || (x % 2 === 0 && y % 2 === 0))
                gameBoard[y][x] = 'wall';
            else gameBoard[y][x] = Math.random() > 0.4 ? 'brick' : 'empty';
        }
    }

    gameBoard[0][0] = 'empty';
    gameBoard[0][1] = 'empty';
    gameBoard[1][0] = 'empty';
    gameBoard[ROWS - 1][COLS - 1] = 'empty';
    gameBoard[ROWS - 1][COLS - 2] = 'empty';
    gameBoard[ROWS - 2][COLS - 1] = 'empty';

    questionOverlay.style.display = 'none';
    gameOverOverlay.style.display = 'none';
    effectPopupsContainer.innerHTML = '';
    
    createBackgroundParticles();
    render();
    startTimer();
    requestAnimationFrame(loop);

    if (!backgroundMusic) {
        backgroundMusic = document.getElementById('backgroundMusic');
    }
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(e => console.log("Auto-play failed:", e));
}

function render() {
    board.innerHTML = '';
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            const c = document.createElement('div');
            c.className = 'cell';
            c.setAttribute('data-x', x);
            c.setAttribute('data-y', y);

            if (gameBoard[y][x] === 'wall') {
                c.textContent = '🪨';
                c.classList.add('wall');
            } else if (gameBoard[y][x] === 'brick') {
                c.textContent = '🪵';
                c.classList.add('brick');
            } else {
                c.classList.add('empty');
            }

            bombs.forEach(b => {
                if (b.x === x && b.y === y) {
                    c.textContent = '💣';
                    c.classList.add('bomb');
                }
            });

            explosions.forEach(e => {
                if (e.x === x && e.y === y) {
                    c.textContent = '💥';
                    c.classList.add('explosion');
                }
            });

            powerUps.forEach(p => {
                if (p.x === x && p.y === y) {
                    if (p.type === 'BOMB_UP') c.textContent = '💣';
                    if (p.type === 'FIRE_UP') c.textContent = '🔥';
                    if (p.type === 'SPEED_UP') c.textContent = '🌪️';
                    c.classList.add('powerup');
                }
            });

            enemies.forEach(e => {
                if (e.x === x && e.y === y) {
                    c.textContent = e.typeDef.icon;
                    c.classList.add('enemy');
                    c.style.boxShadow = `0 0 12px ${e.typeDef.color}`;
                }
            });

            players.forEach(p => {
                if (p.x === x && p.y === y) {
                    c.textContent = p.id === 'p1' ? '🐻' : '🦊';
                    c.classList.add(p.id === 'p1' ? 'player1' : 'player2');
                }
            });

            board.appendChild(c);
        }
    }
    
    timer.textContent = Math.floor(gameTimer / 60).toString().padStart(2, '0') + ":" + String(gameTimer % 60).padStart(2, '0');
    lives1.textContent = '❤️'.repeat(players[0].lives);
    lives2.textContent = '❤️'.repeat(players[1].lives);

    p1BombsEl.textContent = Math.min(players[0].bombs, 10);
    p1RangeEl.textContent = Math.min(players[0].bombRange, 10);
    p1SpeedEl.textContent = Math.min(players[0].displaySpeed, 10);

    p2BombsEl.textContent = Math.min(players[1].bombs, 10);
    p2RangeEl.textContent = Math.min(players[1].bombRange, 10);
    p2SpeedEl.textContent = Math.min(players[1].displaySpeed, 10);
}

function movePlayer(id) {
    const p = players.find(x => x.id === id);
    const key = playerInput[id];
    if (!key) return;

    const now = Date.now();
    if (now - lastMoveTime[id] < 1000 / p.speed) return;

    let dx = 0, dy = 0;
    if (key === 'w' || key === 'ArrowUp') dy = -1;
    if (key === 's' || key === 'ArrowDown') dy = 1;
    if (key === 'a' || key === 'ArrowLeft') dx = -1;
    if (key === 'd' || key === 'ArrowRight') dx = 1;

    const nx = p.x + dx, ny = p.y + dy;
    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return;
    if (gameBoard[ny]?.[nx] !== 'empty') return;
    if (bombs.some(b => b.x === nx && b.y === ny)) return;
    if (enemies.some(e => e.x === nx && e.y === ny)) return;

    p.x = nx; p.y = ny;
    lastMoveTime[id] = now;

    const puIndex = powerUps.findIndex(pu => pu.x === nx && pu.y === ny);
    if (puIndex !== -1) {
        applyPowerUp(p, powerUps[puIndex].type);
        powerUps.splice(puIndex, 1);
    }

    render();
}

function applyPowerUp(p, type) {
    let effectText = '';
    let effectColor = '';
    if (type === 'BOMB_UP') {
        const oldBombs = p.bombs;
        p.bombs = Math.min(p.bombs + 1, 5);
        if (p.bombs > oldBombs) {
            effectText = '💣 BOMB UP!';
            effectColor = '#FFD700';
        }
    }
    if (type === 'FIRE_UP') {
        const oldRange = p.bombRange;
        p.bombRange = Math.min(p.bombRange + 1, 10);
        if (p.bombRange > oldRange) {
            effectText = '🔥 FIRE UP!';
            effectColor = '#FF8C00';
        }
    }
    if (type === 'SPEED_UP') {
        const oldSpeed = p.speed;
        p.speed = Math.min(p.speed + 1, 10);
        p.displaySpeed = Math.min(p.displaySpeed + 1, 10);
        if (p.speed > oldSpeed) {
            effectText = '🌪️ SPEED UP!';
            effectColor = '#32CD32';
        }
    }

    render();

    if (effectText) {
        showEffectPopup(p, effectText, effectColor);
    }
}

function showEffectPopup(player, text, color) {
    const popup = document.createElement('div');
    popup.className = 'effect-popup';
    popup.textContent = text;
    popup.style.color = color;

    const playerElement = document.querySelector(`.cell[data-x="${player.x}"][data-y="${player.y}"]`);
    if (playerElement) {
        const rect = playerElement.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        popup.style.left = `${rect.left - boardRect.left + rect.width / 2}px`;
        popup.style.top = `${rect.top - boardRect.top - 20}px`;
    } else {
        popup.style.left = '50%';
        popup.style.top = '50%';
    }

    popup.style.zIndex = '1002';
    effectPopupsContainer.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 1500);
}

function updateAI() {
    const now = Date.now();

    for (let i = 0; i < enemies.length; i++) {
        const ai = enemies[i];
        const typeSpeed = ENEMY_SPEED[ai.typeDef.type] || 1;
        const effectiveInterval = AI_MOVE_INTERVAL / typeSpeed;

        if (!ai.lastMoveTime) {
            ai.lastMoveTime = now;
        }

        if (now - ai.lastMoveTime < effectiveInterval) {
            continue;
        }

        const target = players.reduce((closest, p) => {
            const distToClosest = Math.abs(ai.x - closest.x) + Math.abs(ai.y - closest.y);
            const distToP = Math.abs(ai.x - p.x) + Math.abs(ai.y - p.y);
            return distToP < distToClosest ? p : closest;
        }, players[0]);

        const dx = Math.sign(target.x - ai.x);
        const dy = Math.sign(target.y - ai.y);

        let possibleMoves = [];

        if (dx !== 0 || dy !== 0) {
            let tryX = ai.x + dx;
            let tryY = ai.y + dy;
            if (isValidMove(tryX, tryY, ai)) {
                possibleMoves.push({ x: tryX, y: tryY });
            }

            if (dx !== 0) {
                if (isValidMove(ai.x, ai.y - 1, ai)) possibleMoves.push({ x: ai.x, y: ai.y - 1 });
                if (isValidMove(ai.x, ai.y + 1, ai)) possibleMoves.push({ x: ai.x, y: ai.y + 1 });
            } else if (dy !== 0) {
                if (isValidMove(ai.x - 1, ai.y, ai)) possibleMoves.push({ x: ai.x - 1, y: ai.y });
                if (isValidMove(ai.x + 1, ai.y, ai)) possibleMoves.push({ x: ai.x + 1, y: ai.y });
            }
        }

        if (possibleMoves.length === 0) {
            const directions = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];

            for (let dir of directions) {
                let tryX = ai.x + dir.dx;
                let tryY = ai.y + dir.dy;
                if (isValidMove(tryX, tryY, ai)) {
                    possibleMoves.push({ x: tryX, y: tryY });
                }
            }
        }

        if (possibleMoves.length > 0) {
            const chosenMove = possibleMoves[0];
            ai.x = chosenMove.x;
            ai.y = chosenMove.y;
            ai.lastMoveTime = now;
        }

        if (!isAnswering) {
            if (players.some(p => p.x === ai.x && p.y === ai.y)) {
                const collidedPlayer = players.find(p => p.x === ai.x && p.y === ai.y);
                showEffectPopup(collidedPlayer, `${collidedPlayer.id.toUpperCase()} Met Wild ${ai.typeDef.type.toUpperCase()}!`, ai.typeDef.color);
                isAnswering = true;
                askQuestion(collidedPlayer, ai);
            }
        }
    }
}

function isValidMove(x, y, enemy) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
    if (gameBoard[y]?.[x] === 'wall') return false;
    if (gameBoard[y]?.[x] === 'brick') return false;
    if (bombs.some(b => b.x === x && b.y === y)) return false;
    if (enemies.some(e => e !== enemy && e.x === x && e.y === y)) return false;
    return true;
}

function explodeBomb(b) {
    bombs = bombs.filter(x => x !== b);
    const blast = [{x: b.x, y: b.y}];
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    dirs.forEach(d => {
        for (let i = 1; i <= b.range; i++) {
            const x = b.x + d[0] * i;
            const y = b.y + d[1] * i;
            if (gameBoard[y]?.[x] === 'wall') return;
            blast.push({x, y});
            if (gameBoard[y]?.[x] === 'brick') {
                gameBoard[y][x] = 'empty';
                const roll = Math.random();
                if (roll < 0.3) {
                    const types = ['BOMB_UP', 'FIRE_UP', 'SPEED_UP'];
                    powerUps.push({ x, y, type: types[Math.floor(Math.random() * types.length)] });
                } else if (roll < 0.45) {
                    const randomType = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
                    enemies.push({
                        id: Date.now() + Math.random(),
                        x, y,
                        lastMoveTime: Date.now(),
                        typeDef: randomType
                    });
                }
                break;
            }
        }
    });

    explosions.push(...blast);
    render();

    players.forEach(p => {
        if (blast.some(e => e.x === p.x && e.y === p.y)) {
            p.lives--;
            showEffectPopup(p, `${p.id.toUpperCase()} hit by explosion!`, '#FF6347');
            if (p.lives <= 0) {
                gameRunning = false;
                clearInterval(timerInterval);
                if (backgroundMusic) {
                    backgroundMusic.pause();
                    backgroundMusic.currentTime = 0;
                }
                showGameOverScreen(p.id === 'p1' ? '🦊 Wild Explorer Wins!' : '🐻 Forest Guardian Wins!');
            }
        }
    });

    setTimeout(() => {
        explosions = [];
        render();
    }, EXPLOSION_DURATION);
}

function placeBomb(p) {
    if (bombs.filter(b => b.owner === p.id).length >= p.bombs) return;
    if (bombs.some(b => b.x === p.x && b.y === p.y)) return;

    const bomb = { x: p.x, y: p.y, owner: p.id, range: p.bombRange };
    bombs.push(bomb);
    render();

    setTimeout(() => explodeBomb(bomb), BOMB_TIMER);
}

function askQuestion(p, enemy) {
    const allQuestions = [...QUESTIONS_DATA.easy, ...QUESTIONS_DATA.medium, ...QUESTIONS_DATA.hard];
    if (!allQuestions || allQuestions.length === 0) {
        console.error('No questions available');
        isAnswering = false;
        return;
    }
    
    const q = allQuestions[Math.floor(Math.random() * allQuestions.length)];

    questionText.textContent = q.q;
    optionsContainer.innerHTML = '';
    q.o.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(p, idx, q.c, enemy, q.explanation);
        optionsContainer.appendChild(btn);
    });
    questionOverlay.dataset.currentEnemyId = enemy.id;
    questionOverlay.style.display = 'flex';
}

function checkAnswer(p, idx, correct, enemy, explanation) {
    isAnswering = false;

    const isCorrect = idx === correct;
    let effectText = '';
    let effectColor = '';
    let isGameOver = false;

    if (isCorrect) {
        const oldLives = p.lives;
        p.lives = Math.min(p.lives + 1, 5);
        if (p.lives > oldLives) {
            effectText = `✅ +1 Life for ${p.id.toUpperCase()}!`;
            effectColor = '#32CD32';
        } else {
            effectText = `✅ Correct, ${p.id.toUpperCase()}!`;
            effectColor = '#FFD700';
        }
    } else {
        const penalty = enemy.typeDef.penalty;
        p.lives -= penalty;
        effectText = `❌ -${penalty} Life for ${p.id.toUpperCase()}!`;
        effectColor = '#DC143C';
        if (p.lives <= 0) {
            isGameOver = true;
        }
    }

    enemies = enemies.filter(e => e.id !== enemy.id);
    questionOverlay.style.display = 'none';
    delete questionOverlay.dataset.currentEnemyId;

    render();

    if (effectText) {
        showEffectPopup(p, effectText, effectColor);
    }

    if (isGameOver) {
        gameRunning = false;
        clearInterval(timerInterval);
        if (backgroundMusic) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
        showGameOverScreen(`${p.id === 'p1' ? '🦊 Wild Explorer' : '🐻 Forest Guardian'} Wins!`);
    }
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!gameRunning) return;
        gameTimer--;
        render();
        if (gameTimer <= 0) {
            gameRunning = false;
            clearInterval(timerInterval);
            if (backgroundMusic) {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
            }
            showGameOverScreen('⏱️ Time\'s Up! Draw!');
        }
    }, 1000);
}

function showGameOverScreen(resultText) {
    gameOverText.textContent = resultText;
    const score = gameTimer + (players[0].lives * 10) + (players[1].lives * 10);
    finalScoreDisplay.textContent = `Final Score: ${score}`;
    gameOverOverlay.style.display = 'flex';
}

function loop() {
    if (!gameRunning) return;
    updateAI();
    requestAnimationFrame(loop);
}

document.onkeydown = e => {
    if (!gameRunning) return;
    if (e.key === ' ') placeBomb(players[0]);
    if (e.key === 'Enter') placeBomb(players[1]);
    if (['w', 'a', 's', 'd'].includes(e.key)) {
        playerInput.p1 = e.key;
        movePlayer('p1');
    }
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        playerInput.p2 = e.key;
        movePlayer('p2');
    }
};

document.getElementById('restart-btn').addEventListener('click', initGame);
playAgainBtn.addEventListener('click', () => {
    gameOverOverlay.style.display = 'none';
    initGame();
});

window.onload = initGame;