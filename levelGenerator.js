// AI Level Generator: Tự động tạo thêm n màn mới đảm bảo 100% giải được
function generateMoreLevels(count = 10) {
    const currentTotal = LEVELS.length;
    const newLevels = [];

    for (let i = 1; i <= count; i++) {
        const nextId = currentTotal + i;
        const newLevel = generateGuaranteedLevel(nextId);
        
        // Cập nhật tên màn để người chơi biết đây là màn AI vừa tạo
        newLevel.name = `Màn ${nextId}: AI Challenge ${nextId}`;
        newLevels.push(newLevel);
    }

    // Đẩy 10 màn mới vào mảng LEVELS chính của game
    LEVELS.push(...newLevels);
    
    console.log(`🤖 AI đã khởi tạo thành công thêm ${count} màn chơi mới!`);
}
