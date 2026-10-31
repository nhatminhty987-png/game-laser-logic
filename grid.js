// Cấu hình chung cho lưới
const GRID_SIZE = 5;

// Hướng di chuyển: 0: Phải, 1: Xuống, 2: Trái, 3: Lên
const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];

// Dữ liệu ma trận bản đồ
// 'E': Ô trống, 'L': Nguồn Laser, 'T': Mục tiêu, '/': Gương 1, '\': Gương 2
let grid = [
    ['L', 'E', 'E', 'E', 'E'],
    ['E', '/', 'E', '\\', 'E'],
    ['E', 'E', 'E', 'E', 'E'],
    ['E', '\\', 'E', '/', 'E'],
    ['E', 'E', 'E', 'E', 'T']
];

let targetHit = false;

// Hàm tính toán góc phản xạ khi tia laser gặp gương
function reflect(dir, mirror) {
    if (mirror === '/') {
        return [3, 2, 1, 0][dir]; // 0->3, 1->2, 2->1, 3->0
    } else if (mirror === '\\') {
        return [1, 0, 3, 2][dir]; // 0->1, 1->0, 2->3, 3->2
    }
    return dir;
}

// Xoay gương tại vị trí (row, col)
function rotateMirror(r, c) {
    if (grid[r][c] === '/') {
        grid[r][c] = '\\';
    } else if (grid[r][c] === '\\') {
        grid[r][c] = '/';
    }
}