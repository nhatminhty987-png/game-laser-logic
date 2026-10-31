const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = canvas.width / GRID_SIZE;

const levelTitle = document.getElementById('levelTitle');
const levelSelect = document.getElementById('levelSelect');
const resetBtn = document.getElementById('resetBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Đổ dữ liệu vào Dropdown & Cập nhật trạng thái các nút chuyển màn
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

    // Cập nhật trạng thái bật/tắt nút Lùi & Tiến
    prevBtn.disabled = currentLevelIndex === 0;
    // Nút Next chỉ bấm được nếu màn tiếp theo đã được mở khóa
    nextBtn.disabled = currentLevelIndex >= unlockedIndex || currentLevelIndex >= LEVELS.length - 1;
}

// Hàm render chính
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    levelTitle.innerText = getCurrentLevel().name;
    levelSelect.value = currentLevelIndex;

    // 1. Vẽ ô bàn cờ
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

    // 2. Vẽ tia Laser
    drawLaserPath();

    // 3. Vẽ pháo hoa
    updateAndDrawConfetti(ctx);

    // 4. Vòng lặp laser & điều kiện thắng
    if (laserProgress < maxLaserLength) {
        laserProgress += 12;
        animationFrameId = requestAnimationFrame(draw);
    } else {
        if (targetHit) {
            if (particles.length === 0) {
                playWinSound();
                let targetCell = laserWaypoints[laserWaypoints.length - 1];
                createConfetti(targetCell.x, targetCell.y, 80);
                
                // Mở khóa màn tiếp theo khi thắng
                saveUnlockedLevel(currentLevelIndex + 1);
                initLevelDropdown();
            }

            ctx.fillStyle = '#a6e3a1';
            ctx.font = 'bold 22px sans-serif';
            if (currentLevelIndex === LEVELS.length - 1) {
                ctx.fillText("XONG TOÀN BỘ GAME!", 80, 35);
            } else {
                ctx.fillText("THẮNG! Bấm ▶ để sang màn", 60, 35);
            }
        }
        
        if (particles.length > 0) {
            animationFrameId = requestAnimationFrame(draw);
        }
    }
}

// Bắt sự kiện người dùng
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

// Sự kiện bấm nút Màn trước ◀
prevBtn.addEventListener('click', () => {
    if (prevLevel()) {
        clearConfetti();
        initLevelDropdown();
        triggerLaserAnimation();
    }
});

// Sự kiện bấm nút Màn tiếp theo ▶
nextBtn.addEventListener('click', () => {
    if (nextLevel()) {
        clearConfetti();
        initLevelDropdown();
        triggerLaserAnimation();
    }
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
    initLevelDropdown();
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
