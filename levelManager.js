const STORAGE_KEY = "laser_logic_unlocked_level";

// Lấy chỉ số màn chơi cao nhất đã mở khóa từ LocalStorage
function getUnlockedLevelIndex() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseInt(saved, 10) : 0; // Mặc định mở Màn 1 (index 0)
}

// Lưu màn chơi mở khóa mới vào LocalStorage
function saveUnlockedLevel(index) {
    const currentUnlocked = getUnlockedLevelIndex();
    if (index > currentUnlocked) {
        localStorage.setItem(STORAGE_KEY, index);
    }
}

// Hàm tạo 1 màn chơi ngẫu nhiên đảm bảo có lời giải
function generateRandomLevel(id) {
    const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('E'));
    
    // Đặt nguồn L ở góc trên bên trái
    grid[0][0] = 'L';
    
    let x = 0, y = 0;
    let dir = 0; // 0: sang phải, 1: xuống, 2: sang trái, 3: lên
    
    // Số lượng gương tăng dần theo level để tăng độ khó
    const mirrorCount = Math.min(3 + Math.floor(id / 10), 12);
    let mirrorsPlaced = 0;

    // Giả lập đường đi của laser và đặt gương
    for (let i = 0; i < 30 && mirrorsPlaced < mirrorCount; i++) {
        let nextX = x + DX[dir];
        let nextY = y + DY[dir];

        // Nếu chạm biên thì đổi hướng
        if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
            dir = (dir + 1) % 4;
            continue;
        }

        x = nextX;
        y = nextY;

        // Tỷ lệ ngẫu nhiên đặt gương tại ô hiện tại (tránh ô 0,0)
        if ((x !== 0 || y !== 0) && Math.random() < 0.4 && grid[y][x] === 'E') {
            const mirrorType = Math.random() < 0.5 ? '/' : '\\';
            grid[y][x] = mirrorType;
            dir = reflect(dir, mirrorType);
            mirrorsPlaced++;
        }
    }

    // Đặt mục tiêu T tại ô dừng chân cuối cùng (nếu trùng L thì đặt ở góc 4,4)
    if (grid[y][x] === 'L' || (x === 0 && y === 0)) {
        grid[GRID_SIZE - 1][GRID_SIZE - 1] = 'T';
    } else {
        grid[y][x] = 'T';
    }

    // Xoay ngẫu nhiên các gương đã đặt để tạo câu đố cho người chơi giải
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
const LEVELS = Array.from({ length: 100 }, (_, index) => generateRandomLevel(index + 1));

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
        saveUnlockedLevel(currentLevelIndex); // Lưu tiến trình khi mở màn mới
        loadCurrentLevel();
        return true;
    }
    return false;
}
// Xóa tiến trình đã lưu trong LocalStorage
function clearSaveData() {
    localStorage.removeItem(STORAGE_KEY);
    currentLevelIndex = 0; // Đưa về màn 1
    loadCurrentLevel();
}
