// Khởi tạo AudioContext từ Web Audio API
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

// Khởi tạo context khi có tương tác người dùng (tránh chính sách Autoplay của trình duyệt)
function initAudio() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 1. Phát tiếng "Lạch cạch" khi xoay gương (Click sound)
function playRotateSound() {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Tần số giảm nhanh tạo tiếng click ngắn
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
}

// 2. Phát tiếng Laser "Pew/Zzz" khi bắn
function playLaserSound() {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth'; // Dạng sóng răng cưa cho âm thanh đậm chất laser/sci-fi
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
}

// 3. Phát tiếng chuông chiến thắng (Win sound)
function playWinSound() {
    initAudio();
    if (!audioCtx) return;

    // Chuỗi nốt nhạc chiến thắng: Do - Mi - Sol - Do(cao)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.1);

        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + index * 0.1 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + index * 0.1);
        osc.stop(audioCtx.currentTime + index * 0.1 + 0.25);
    });
}