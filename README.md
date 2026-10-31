🧩 Laser Logic Puzzle ⚡
Một trò chơi giải đố 2D dạng Tile-based/Grid được xây dựng hoàn toàn bằng HTML5 Canvas, Tailwind CSS, và Vanilla JavaScript. Người chơi tương tác với các ô gương để bẻ hướng tia laser sao cho chạm trúng mục tiêu.

🌟 Tính Năng Nổi Bật
🎯 Lối chơi giải đố logic nhẹ nhàng nhưng lôi cuốn: Tính toán góc phản xạ 90 
∘
  của tia laser để vượt qua các thử thách từ dễ đến khó.

🎨 Giao diện Modern Dark Mode: Thiết kế tinh tế bằng Tailwind CSS, hỗ trợ responsive hoàn hảo trên cả điện thoại di động và máy tính.

⚡ Hiệu ứng tia Laser Glow & Particle Confetti: Hoạt ảnh tia laser phát sáng bắn mượt mà kết hợp hiệu ứng pháo hoa ăn mừng khi hoàn thành màn chơi.

🔊 Âm thanh tổng hợp (Web Audio API): Tích hợp hiệu ứng âm thanh sống động (Xoay gương, bắn laser, chuông chiến thắng) trực tiếp bằng mã nguồn mà không cần tải file mp3 bên ngoài.

💾 Lưu tiến trình bằng LocalStorage: Mở khóa dần các màn chơi và tự động lưu lại màn chơi cao nhất bạn đã vượt qua.

🎮 Cách Chơi (How to Play)
Mục tiêu: Điều khiển tia laser xuất phát từ Nguồn Laser (Ô màu xanh lá L) chạm trúng Mục tiêu (Ô tròn T).

Thao tác:

Click chuột hoặc chạm vào các ô chứa Gương (/ hoặc \) để xoay góc phản xạ của gương.

Mỗi lần nhấp, gương sẽ đổi hướng nghiêng và bẻ cong tia laser 90 
∘
 .

Thắng cuộc: Khi tia laser chiếu tới ô Mục tiêu, hiệu ứng pháo hoa sẽ nổ ra và game tự động chuyển sang màn tiếp theo sau vài giây!

🛠️ Cấu Trúc Dự Án (Project Structure)
Dự án được tối ưu hóa thành một file đơn duy nhất (index.html) giúp dễ dàng chạy trực tiếp hoặc chia sẻ:

laser-logic-game/
├── index.html        # File chứa toàn bộ HTML, CSS (Tailwind) & JavaScript Logic
└── README.md         # File hướng dẫn và tài liệu dự án

Các thành phần chính trong code (index.html):
UI & Layout: Khung chứa Canvas, thanh chọn màn chơi (Dropdown), nút Reset và nút Xóa dữ liệu.

Web Audio API Synth: Trình phát âm thanh giả lập tần số bằng JavaScript.

Particle System: Hệ thống mô phỏng hạt pháo hoa Confetti rơi tự do bằng gia tốc trọng lực.

Laser Path Finding & Animation Engine: Thuật toán tính toán mảng 2D và render hoạt ảnh laser tăng dần độ dài theo thời gian.

🚀 Cách Khởi Chạy (Usage)
Tải file index.html về máy tính của bạn.

Nhấp đúp chuột vào file index.html hoặc chọn Open with Live Server trong Visual Studio Code.

Chơi trực tiếp trên bất kỳ trình duyệt web nào (Chrome, Edge, Safari, Firefox).

📝 Giấy Phép (License)
Dự án này được phát hành dưới giấy phép MIT License. Bạn có thể tự do chỉnh sửa, nâng cấp và chia sẻ.
