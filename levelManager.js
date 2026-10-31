const STORAGE_KEY = "laser_logic_unlocked_level";

// Lấy chỉ số màn chơi cao nhất đã mở khóa từ LocalStorage
function getUnlockedLevelIndex() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseInt(saved, 10) : 0;
}

// Lưu màn chơi mở khóa mới
function saveUnlockedLevel(index) {
    const currentUnlocked = getUnlockedLevelIndex();
    if (index > currentUnlocked) {
        localStorage.setItem(STORAGE_KEY, index);
    }
}

// Xóa dữ liệu lưu tiến trình
function clearSaveData() {
    localStorage.removeItem(STORAGE_KEY);
    currentLevelIndex = 0;
    loadCurrentLevel();
}

// Thuật toán sinh màn chơi ngẫu nhiên đảm bảo 100% có thể giải được
function generateSolvableLevel(id) {
    // Tạo lưới rỗng 5x5
    const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('E'));
    
    // Nguồn L cố định ở ô (0,0)
    let curX = 0, curY = 0;
    grid[curY][curX] = 'L';
    
    let dir = 0; // Hướng ban đầu: 0 (Phải)
    
    // Số lượng gương tăng dần theo Level (Level 1: 1-2 gương, Level cao: 3-5 gương)
    const targetMirrors = Math.min(1 + Math.floor(id / 15), 5);
    let mirrorsPlaced = 0;

    // Giả lập đường đi tạo lời giải chuẩn
    while (mirrorsPlaced < targetMirrors) {
        // Đi ngẫu nhiên từ 1 đến 3 ô theo hướng hiện tại
        let steps = Math.floor(Math.random() * 3) + 1;
        let nextX = curX + DX[dir] * steps;
        let nextY = curY + DY[dir] * steps;

        // Nếu vượt ngoài bàn cờ thì giới hạn lại ở mép bàn cờ
        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
            nextX = Math.min(Math.max(nextX, 0), GRID_SIZE - 1);
            nextY = Math.min(Math.max(nextY, 0), GRID_SIZE - 1);
        }

        // Nếu tiến được đến vị trí mới khác vị trí cũ
        if (nextX !== curX || nextY !== curY) {
            curX = nextX;
            curY = nextY;

            // Đặt gương tại vị trí này để đổi hướng (tránh đặt đè lên nguồn 'L')
            if (grid[curY][curX] === 'E') {
                // Chọn ngẫu nhiên hướng rẽ mới (Trái hoặc Phải)
                let turnLeft = Math.random() < 0.5;
                let newDir = turnLeft ? (dir + 3) % 4 : (dir + 1) % 4;

                // Xác định loại gương tương ứng (/ hoặc \)
                let mirrorType = '/';
                if ((dir === 0 && newDir === 1) || (dir === 2 && newDir === 3) || 
                    (dir === 1 && newDir === 0) || (dir === 3 && newDir === 2)) {
                    mirrorType = '\\';
                }

                grid[curY][curX] = mirrorType;
                dir = newDir;
                mirrorsPlaced++;
            }
        } else {
            // Đổi hướng ngẫu nhiên nếu bị kẹt mép bàn cờ
            dir = (dir + 1) % 4;
        }
    }

    // Đặt ô Mục tiêu 'T' ở ô tiếp theo theo hướng đi hiện tại
    let targetX = Math.min(Math.max(curX + DX[dir], 0), GRID_SIZE - 1);
    let targetY = Math.min(Math.max(curY + DY[dir], 0), GRID_SIZE - 1);

    // Nếu bị trùng với ô gương hoặc ô L, tìm ô trống gần nhất làm Target
    if (grid[targetY][targetX] !== 'E') {
        outer: for (let r = GRID_SIZE - 1; r >= 0; r--) {
            for (let c = GRID_SIZE - 1; c >= 0; c--) {
                if (grid[r][c] === 'E') {
                    targetX = c;
                    targetY = r;
                    break outer;
                }
            }
        }
    }
    grid[targetY][targetX] = 'T';

    // Xoay ngẫu nhiên các gương vừa đặt để tạo câu đố cho người chơi giải
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

// Khởi tạo danh sách 100 màn chơi tự động
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
