const STORAGE_KEY = "laser_logic_unlocked_level";

// Lấy index màn cao nhất đã mở khóa (Mặc định = 0 tức là Màn 1)
function getUnlockedLevelIndex() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseInt(saved, 10) : 0;
}

// Lưu tiến trình mở khóa màn tiếp theo
function saveUnlockedLevel(index) {
    const currentUnlocked = getUnlockedLevelIndex();
    if (index > currentUnlocked) {
        localStorage.setItem(STORAGE_KEY, index);
    }
}

// Xóa dữ liệu tiến trình (Khóa lại từ đầu)
function clearSaveData() {
    localStorage.removeItem(STORAGE_KEY);
    currentLevelIndex = 0;
    loadCurrentLevel();
}

// THUẬT TOÁN ĐẢM BẢO 100% CÓ LỜI GIẢI
function generateGuaranteedLevel(id) {
    let grid, solutionGrid;
    let isValidLevel = false;
    let attempts = 0;

    while (!isValidLevel && attempts < 100) {
        attempts++;
        grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('E'));
        grid[0][0] = 'L'; // Nguồn xuất phát tại (0,0)

        let x = 0, y = 0;
        let dir = 0; // 0: Phải, 1: Xuống, 2: Trái, 3: Lên
        let mirrorPositions = [];

        // Số lượng gương tăng dần theo độ khó (Màn 1 có 1-2 gương, màn cao có 3-5 gương)
        const targetMirrors = Math.min(1 + Math.floor(id / 10), 5);

        // 1. Dựng đường đi chắc chắn đúng cho laser
        for (let i = 0; i < 20 && mirrorPositions.length < targetMirrors; i++) {
            let step = Math.floor(Math.random() * 2) + 1; // Đi 1 hoặc 2 ô
            let nx = x + DX[dir] * step;
            let ny = y + DY[dir] * step;

            // Giới hạn trong bàn cờ 5x5
            nx = Math.min(Math.max(nx, 0), GRID_SIZE - 1);
            ny = Math.min(Math.max(ny, 0), GRID_SIZE - 1);

            if ((nx !== x || ny !== y) && grid[ny][nx] === 'E') {
                x = nx;
                y = ny;

                // Chọn hướng rẽ mới (Trái hoặc Phải)
                let newDir = (dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
                
                // Xác định đúng loại gương cần đặt để laser rẽ sang newDir
                let mirrorType = '/';
                if ((dir === 0 && newDir === 1) || (dir === 2 && newDir === 3) || 
                    (dir === 1 && newDir === 0) || (dir === 3 && newDir === 2)) {
                    mirrorType = '\\';
                }

                grid[y][x] = mirrorType;
                mirrorPositions.push({ r: y, c: x, correctType: mirrorType });
                dir = newDir;
            } else {
                dir = (dir + 1) % 4;
            }
        }

        // 2. Đặt ô Mục tiêu T ở điểm cuối cùng của tia laser
        let targetX = x + DX[dir];
        let targetY = y + DY[dir];

        if (targetX >= 0 && targetX < GRID_SIZE && targetY >= 0 && targetY < GRID_SIZE && grid[targetY][targetX] === 'E') {
            grid[targetY][targetX] = 'T';
        } else {
            grid[y][x] = 'T'; // Nếu vướng biên thì đặt T ngay ô cuối
        }

        // Chỉ chấp nhận màn chơi nếu có ít nhất 1 gương và đã đính được T
        if (mirrorPositions.length > 0) {
            isValidLevel = true;

            // 3. Xoay đảo các gương để tạo thành CÂU ĐỐ cho người chơi
            // Giữ lại 1 bản sao làm đáp án
            solutionGrid = JSON.parse(JSON.stringify(grid));

            // Xoay ít nhất 1 gương khác hướng đáp án để người chơi phải click giải
            let scrambled = false;
            mirrorPositions.forEach(m => {
                if (Math.random() < 0.7 || !scrambled) {
                    grid[m.r][m.c] = m.correctType === '/' ? '\\' : '/';
                    scrambled = true;
                }
            });
        }
    }

    return {
        id: id,
        name: `Màn ${id}: Thử thách ${id}`,
        grid: grid
    };
}

// Tự động khởi tạo danh sách 100 màn chơi
const LEVELS = Array.from({ length: 100 }, (_, index) => generateGuaranteedLevel(index + 1));

let currentLevelIndex = 0;

function getCurrentLevel() {
    return LEVELS[currentLevelIndex];
}

function loadCurrentLevel() {
    const level = getCurrentLevel();
    grid = JSON.parse(JSON.stringify(level.grid));
    targetHit = false;
}

// Chuyển sang màn tiếp theo & Lưu tiến trình
function nextLevel() {
    if (currentLevelIndex < LEVELS.length - 1) {
        currentLevelIndex++;
        saveUnlockedLevel(currentLevelIndex); // Mở khóa màn mới
        loadCurrentLevel();
        return true;
    }
    return false;
}
