// Quản lý biến hoạt ảnh laser
let laserProgress = 0;
let maxLaserLength = 0;
let laserWaypoints = [];
let animationFrameId = null;

// 1. Tính toán tọa độ các điểm mốc laser
function calculateLaserPath() {
    laserWaypoints = [];
    let x = 0, y = 0;
    let dir = 0;
    targetHit = false;

    let startX = x * TILE_SIZE + TILE_SIZE / 2;
    let startY = y * TILE_SIZE + TILE_SIZE / 2;
    laserWaypoints.push({ x: startX, y: startY });

    let totalLength = 0;

    while (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
        let currentCell = grid[y][x];

        if (currentCell === '/' || currentCell === '\\') {
            dir = reflect(dir, currentCell);
        } else if (currentCell === 'T') {
            targetHit = true;
        }

        let prevX = x, prevY = y;
        x += DX[dir];
        y += DY[dir];

        let drawX = Math.min(Math.max(x, -0.5), GRID_SIZE - 0.5) * TILE_SIZE + TILE_SIZE / 2;
        let drawY = Math.min(Math.max(y, -0.5), GRID_SIZE - 0.5) * TILE_SIZE + TILE_SIZE / 2;

        laserWaypoints.push({ x: drawX, y: drawY });

        let prevPointX = Math.min(Math.max(prevX, -0.5), GRID_SIZE - 0.5) * TILE_SIZE + TILE_SIZE / 2;
        let prevPointY = Math.min(Math.max(prevY, -0.5), GRID_SIZE - 0.5) * TILE_SIZE + TILE_SIZE / 2;
        totalLength += Math.hypot(drawX - prevPointX, drawY - prevPointY);
    }

    maxLaserLength = totalLength;
}

// 2. Vẽ đường laser phát sáng
function drawLaserPath() {
    if (laserWaypoints.length < 2) return;

    ctx.strokeStyle = '#f38ba8';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#f38ba8';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(laserWaypoints[0].x, laserWaypoints[0].y);

    let remainingProgress = laserProgress;

    for (let i = 0; i < laserWaypoints.length - 1; i++) {
        let p1 = laserWaypoints[i];
        let p2 = laserWaypoints[i + 1];
        let segmentDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

        if (remainingProgress >= segmentDist) {
            ctx.lineTo(p2.x, p2.y);
            remainingProgress -= segmentDist;
        } else {
            let ratio = remainingProgress / segmentDist;
            let currentX = p1.x + (p2.x - p1.x) * ratio;
            let currentY = p1.y + (p2.y - p1.y) * ratio;
            ctx.lineTo(currentX, currentY);
            break;
        }
    }

    ctx.stroke();
    ctx.shadowBlur = 0;
}

// 3. Hàm Kích hoạt Hoạt ảnh Laser từ đầu
function triggerLaserAnimation() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    laserProgress = 0;
    calculateLaserPath();
    draw(); // Gọi hàm render chính trong game.js
}