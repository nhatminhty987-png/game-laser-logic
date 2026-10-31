const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = canvas.width / GRID_SIZE;

const levelTitle = document.getElementById('levelTitle');
const levelSelect = document.getElementById('levelSelect');
const resetBtn = document.getElementById('resetBtn');
const clearDataBtn = document.getElementById('clearDataBtn');

// Đổ dữ liệu màn chơi vào Menu Dropdown dựa trên tiến trình đã lưu
function initLevelDropdown() {
    levelSelect.innerHTML = '';
    const unlockedIndex = getUnlockedLevelIndex();

    LEVELS.forEach((lvl, index) => {
        const option = document.createElement('option');
        option.value = index;
        if (index <= unlockedIndex) {
            option.textContent = lvl.name;
        } else {
            option.textContent = `🔒 ${lvl.name} (Khóa)`;
            option.disabled = true;
        }
        levelSelect.appendChild(option);
    });
}

// Hàm vẽ và cập nhật khung hình chính (Main Render Loop)
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    levelTitle.innerText = getCurrentLevel().name;
    levelSelect.value = currentLevelIndex;

    // 1. Vẽ ô và môi trường trên bàn cờ
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            ctx.strokeStyle = '#313244';
            ctx.lineWidth = 1;
            ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

            let type = grid[r][c];
            let cx = c * TILE_SIZE + TILE_SIZE / 2;
            let cy = r * TILE_SIZE + TILE_SIZE / 2;

            if (type === 'L') {
                ctx.fillStyle = '#a6e3a1';
                ctx.fillRect(c * TILE_SIZE + 15, r * TILE_SIZE + 15, TILE_SIZE - 30, TILE_SIZE - 30);
            } else if (type === 'T') {
                let isHitAndFinished = targetHit && (laserProgress >= maxLaserLength);
                ctx.fillStyle = isHitAndFinished ? '#f9e2af' : '#45475a';
                ctx.beginPath();
                ctx.arc(cx, cy, 20, 0, Math.PI * 2);
                ctx.fill();
            } else if (type === '/' || type === '\\') {
                ctx.strokeStyle = '#89b4fa';
                ctx.lineWidth = 6;
                ctx.beginPath();
                if (type === '/') {
                    ctx.moveTo(c * TILE_SIZE + 15, (r + 1) * TILE_SIZE - 15);
                    ctx.lineTo((c + 1) * TILE_SIZE - 15, r * TILE_SIZE + 15);
                } else {
                    ctx.moveTo(c * TILE_SIZE + 15, r * TILE_SIZE + 15);
                    ctx.lineTo((c + 1) * TILE_SIZE - 15, (r + 1) * TILE_SIZE - 15);
                }
                ctx.stroke();
            }
        }
    }

    // 2. Vẽ tia Laser (Hàm nằm trong laserAnimator.js)
    drawLaserPath();

    // 3. Cập nhật và vẽ các hạt pháo hoa nếu có (Hàm nằm trong confetti.js)
    updateAndDrawConfetti(ctx);

    // 4. Vòng lặp bắn tia laser và xử lý chiến thắng
    if (laserProgress < maxLaserLength) {
        laserProgress += 12;
        animationFrameId = requestAnimationFrame(draw);
    } else {
        if (targetHit) {
            // Bắn pháo hoa 1 lần tại vị trí ô Mục tiêu khi tia vừa chạm tới
            if (particles.length === 0) {
                playWinSound();
                let targetCell = laserWaypoints[laserWaypoints.length - 1];
                createConfetti(targetCell.x, targetCell.y, 80);
            }

            ctx.fillStyle = '#a6e3a1';
            ctx.font = 'bold 22px sans-serif';
            if (currentLevelIndex === LEVELS.length - 1) {
                ctx.fillText("XONG TOÀN BỘ GAME!", 80, 35);
            } else {
                ctx.fillText("THẮNG! Đang qua màn...", 80, 35);
                setTimeout(() => {
                    if (nextLevel()) {
                        clearConfetti();
                        initLevelDropdown();
                        triggerLaserAnimation();
                    }
                }, 1500);
            }
        }
        
        // Tiếp tục animation loop nếu pháo hoa vẫn đang rơi
        if (particles.length > 0) {
            animationFrameId = requestAnimationFrame(draw);
        }
    }
}

// Bắt các sự kiện tương tác người dùng
canvas.addEventListener('click', (e) => {
    if (targetHit && currentLevelIndex === LEVELS.length - 1 && laserProgress >= maxLaserLength) return;

    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const r = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    rotateMirror(r, c);
    clearConfetti();
    playRotateSound();
    playLaserSound();
    triggerLaserAnimation();
});

resetBtn.addEventListener('click', () => {
    loadCurrentLevel();
    clearConfetti();
    triggerLaserAnimation();
});

levelSelect.addEventListener('change', (e) => {
    currentLevelIndex = parseInt(e.target.value, 10);
    loadCurrentLevel();
    clearConfetti();
    triggerLaserAnimation();
});

clearDataBtn.addEventListener('click', () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ tiến trình chơi không?")) {
        clearSaveData();
        clearConfetti();
        initLevelDropdown();
        triggerLaserAnimation();
    }
});

// Khởi tạo game
initLevelDropdown();
loadCurrentLevel();
triggerLaserAnimation();