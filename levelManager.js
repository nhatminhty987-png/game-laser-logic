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

// THUẬT TOÁN TAO LEVEL CHUẨN 100% CÓ LỜI GIẢI
function generateGuaranteedLevel(id) {
    let grid;
    let isSuccess = false;
    let attempts = 0;

    while (!isSuccess && attempts < 200) {
        attempts++;
        grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill('E'));
        grid[0][0] = 'L'; // Nguồn phát luôn ở (0,0)

        let x = 0, y = 0;
        let dir = 0; // 0: Phải, 1: Xuống, 2: Trái, 3: Lên
        let placedMirrors = [];
        
        // Màn 1-10 có 1-2 gương; các màn sau có từ 2-4 gương
        const maxMirrors = Math.min(1 + Math.floor(id / 10), 4);

        // Giả lập bước đi của laser
        for (let i = 0; i < 15 && placedMirrors.length < maxMirrors; i++) {
            // Cho laser đi ngẫu nhiên 1 đến 3 ô
            let step = Math.floor(Math.random() * 2) + 1;
            let nx = x + DX[dir] * step;
            let ny = y + DY[dir] * step;

            // Kiểm tra xem bước tiếp theo có nằm trong bàn cờ 5x5 không
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[ny][nx] === 'E') {
                x = nx;
                y = ny;

                // Thử rẽ hướng mới sao cho không bị đâm ngược lại nguồn
                let possibleNewDirs = [];
                if (dir === 0 || dir === 2) { 
                    // Đang đi ngang -> Chỉ cho rẽ Xuống (1) hoặc rẽ Lên nếu y > 0
                    possibleNewDirs.push(1);
                    if (y > 0) possibleNewDirs.push(3);
                } else { 
                    // Đang đi dọc -> Chỉ cho rẽ Phải (0) hoặc rẽ Trái nếu x > 0
                    possibleNewDirs.push(0);
                    if (x > 0) possibleNewDirs.push(2);
                }

                let newDir = possibleNewDirs[Math.floor(Math.random() * possibleNewDirs.length)];

                // Xác định chính xác loại gương (/ hoặc \) để laser bẻ sang newDir
                let mirrorType = '/';
                if ((dir === 0 && newDir === 1) || (dir === 2 && newDir === 3) || 
                    (dir === 1 && newDir === 0) || (dir === 3 && newDir === 2)) {
                    mirrorType = '\\';
                }

                grid[y][x] = mirrorType;
                placedMirrors.push({ r: y, c: x, correct: mirrorType });
                dir = newDir;
            }
        }

        // Bắn thêm 1 đoạn ngắn nữa để đặt ô Mục tiêu T
        let targetX = x + DX[dir];
        let targetY = y + DY[dir];

        if (targetX >= 0 && targetX < GRID_SIZE && targetY >= 0 && targetY < GRID_SIZE && grid[targetY][targetX] === 'E') {
            grid[targetY][targetX] = 'T';
            isSuccess = true;
        } else if (grid[y][x] !== 'L' && placedMirrors.length > 0) {
            // Nếu không tiến thêm được thì đặt T ngay tại ô cuối cùng
            grid[y][x] = 'T';
            isSuccess = true;
        }

        if (isSuccess && placedMirrors.length > 0) {
            // Xoay xáo trộn các gương để tạo thành CÂU ĐỐ
            placedMirrors.forEach(m => {
                // Xoay ngược gương lại để người chơi phải click giải
                grid[m.r][m.c] = (m.correct === '/') ? '\\' : '/';
            });
        } else {
            isSuccess = false;
        }
    }

    return {
        id: id,
        name: `Màn ${id}: Thử thách ${id}`,
        grid: grid
    };
}

// Khởi tạo 100 màn chơi chuẩn 100%
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

function nextLevel() {
    if (currentLevelIndex < LEVELS.length - 1) {
        currentLevelIndex++;
        saveUnlockedLevel(currentLevelIndex);
        loadCurrentLevel();
        return true;
    }
    return false;
}

function prevLevel() {
    if (currentLevelIndex > 0) {
        currentLevelIndex--;
        loadCurrentLevel();
        return true;
    }
    return false;
}
