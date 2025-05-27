export function getRandomDateRange() {
    const now = new Date();

    // смещение в пределах ±2 дней (в миллисекундах)
    const offset = Math.floor(Math.random() * 4 * 24 * 60 * 60 * 1000) - 2 * 24 * 60 * 60 * 1000;
    const startDate = new Date(now.getTime() + offset);

    // смещение конца на 1-6 часов вперёд
    const endOffset = Math.floor(Math.random() * 6 * 60 * 60 * 1000) + 1 * 60 * 60 * 1000;
    const endDate = new Date(startDate.getTime() + endOffset);

    // форматируем в ISO без миллисекунд
    const startStr = startDate.toISOString().split('.')[0];
    const endStr = endDate.toISOString().split('.')[0];

    return { startStr, endStr };
}