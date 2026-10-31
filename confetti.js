let particles = [];
const CONFETTI_COLORS = ['#f38ba8', '#89b4fa', '#a6e3a1', '#f9e2af', '#cba6f7', '#fab387'];

// Lớp đại diện cho 1 hạt pháo hoa
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 4; // Kích thước ngẫu nhiên 4-10px
        this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        
        // Vận tốc nổ tung xòe theo mọi hướng
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2; // Bắn hất nhẹ lên trên
        
        this.gravity = 0.15; // Trọng lực kéo hạt rơi xuống
        this.drag = 0.96;    // Độ cản không khí
        this.alpha = 1;      // Độ trong suốt (mờ dần theo thời gian)
        this.decay = Math.random() * 0.015 + 0.01;
    }

    update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity;

        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.restore();
    }
}

// Bắn pháo hoa từ vị trí (x, y)
function createConfetti(x, y, count = 60) {
    for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y));
    }
}

// Cập nhật và vẽ tất cả các hạt trên Canvas
function updateAndDrawConfetti(ctx) {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
            particles.splice(i, 1); // Xóa hạt đã mờ hẳn
        }
    }
}

// Reset xóa sạch hạt khi sang màn mới
function clearConfetti() {
    particles = [];
}