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

// Mảng chứa các level từ dễ đến khó
const LEVELS = [
    {
    id: 1,
    name: "Màn 1: Làm quen",
    grid: [
        ['L', 'E', 'E', 'E', '/'], // Đặt gương '/' ở ô (0, 3) để đón tia laser bắn từ nguồn (0,0) sang!
        ['E', 'E', 'E', 'E', 'E'],
        ['E', 'E', 'E', 'E', 'E'],
        ['E', 'E', 'E', 'E', 'E'],
        ['E', 'E', 'E', 'E', 'T']
    ]
},
    {
        id: 2,
        name: "Màn 2: Dịch chuyển tia",
        grid: [
            ['L', 'E', 'E', '/', 'E'],
            ['E', 'E', 'E', 'E', 'E'],
            ['E', 'E', 'E', 'E', 'E'],
            ['E', '/', 'E', '/', 'E'],
            ['E', '/', 'E', 'E', 'T']
        ]
    },
    {
        id: 3,
        name: "Màn 3: Labyrinth Laser",
        grid: [
            ['L', 'E', 'E', '/', 'E'],
            ['E', '/', 'E', '/', 'E'],
            ['E', 'E', 'E', 'E', 'E'],
            ['E', '/', 'E', '/', 'E'],
            ['E', 'E', 'E', '/', 'T']
        ]
    }
];

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