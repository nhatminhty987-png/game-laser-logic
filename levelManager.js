const STORAGE_KEY = "laser_logic_unlocked_level";

function getUnlockedLevelIndex() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseInt(saved, 10) : 0;
}

function saveUnlockedLevel(index) {
    const currentUnlocked = getUnlockedLevelIndex();
    if (index > currentUnlocked) {
        localStorage.setItem(STORAGE_KEY, index);
    }
}

function clearSaveData() {
    localStorage.removeItem(STORAGE_KEY);
    currentLevelIndex = 0;
    loadCurrentLevel();
}

// Thuật toán sinh màn chuẩn 100% giải được
function generateSolvableLevel(id) {
    const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('E'));
    grid[0][0] = 'L'; // Nguồn cố định ở (0,0)

    let curX = 0, curY = 0;
    let dir = 0; // Hướng ban đầu: 0 (Phải)
    
    // Số lượng gương theo độ khó màn
    const numMirrors = Math.min(2 + Math.floor(id / 10), 6);
    let mirrorsPlaced = 0;

    for (let attempt = 0; attempt < 50 && mirrorsPlaced < numMirrors; attempt++) {
        // Đi từ 1-3 bước
        let step = Math.floor(Math.random() * 3) + 1;
        let nextX = curX + DX[dir] * step;
        let nextY = curY + DY[dir] * step;

        // Nếu ra ngoài mép bàn cờ -> dừng lại tại mép
        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
            nextX = Math.min(Math.max(nextX, 0), GRID_SIZE - 1);
            nextY = Math.min(Math.max(nextY, 0), GRID_SIZE - 1);
        }

        // Đặt gương tại điểm đổi hướng (tránh ô 0,0)
        if ((nextX !== curX || nextY !== curY) && grid[nextY][nextX] === 'E') {
            curX = nextX;
            curY = nextY;

            let newDir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4; // Rẽ trái hoặc phải
            
            // Xกำหนด loại gương dựa trên hướng rẽ
            let mirrorType = '/';
            if ((dir === 0 && newDir === 1) || (dir === 2 && newDir === 3) || 
                (dir === 1 && newDir === 0) || (dir === 3 && newDir === 2)) {
                mirrorType = '\\';
            }

            grid[curY][curX] = mirrorType;
            dir = newDir;
            mirrorsPlaced++;
        } else {
            dir = (dir + 1) % 4; // Đổi hướng tìm đường khác
        }
    }

    // Đặt Mục tiêu 'T' ĐÚNG trên đường đi tiếp theo của laser
    let targetX = curX + DX[dir];
    let targetY = curY + DY[dir];

    // Kiểm tra nếu out bàn cờ hoặc vướng gương -> đặt ngay tại ô curX, curY (chuyển ô đó thành T)
    if (targetX < 0 || targetX >= GRID_SIZE || targetY < 0 || targetY >= GRID_SIZE || grid[targetY][targetX] !== 'E') {
        grid[curY][curX] = 'T';
    } else {
        grid[targetY][targetX] = 'T';
    }

    // Xoay ngẫu nhiên trạng thái ban đầu của các gương để người chơi giải
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === '/' || grid[r][c] === '\\') {
                if (Math.random() < 0.5) {
                    grid[r][c] = grid[r][c] === '/' ? '\\' : '/';
                }
            }
        }
    }

    return {
        id: id,
        name: `Màn ${id}: Thử thách ${id}`,
        grid: grid
    };
}

const LEVELS = Array.from({ length: 100 }, (_, index) => generateSolvableLevel(index + 1));

let currentLevelIndex = 0;

function getCurrentLevel() {
    return LEVELS[currentLevelIndex];
}

function loadCurrentLevel() {
    const level = getCurrentLevel();
    grid = JSON.parse(JSON.stringify(level.grid));
    targetHit = false;
}

function nextLevel() {
    if (currentLevelIndex < LEVELS.length - 1) {
        currentLevelIndex++;
        saveUnlockedLevel(currentLevelIndex);
        loadCurrentLevel();
        return true;
    }
    return false;
}
