import dayjs from 'dayjs';

export const formatTime = (dateString) => {
    const now = dayjs();
    const date = dayjs(dateString);
    const diffDays = now.diff(date, 'day'); // 计算天数差

    const timeFormatted = date.format('HH:mm'); // 统一时间格式化

    const isThisYear = now.year() === date.year();

    if (diffDays === 0) {
        return timeFormatted; // 今天
    } else if (diffDays === 1) {
        return `昨天 ${timeFormatted}`; // 昨天
    } else if (diffDays === 2) {
        return `前天 ${timeFormatted}`; // 前天
    } else if (isThisYear) {
        return date.format('MM/DD ') + timeFormatted; // 更早的日期
    } else {
        return date.format('YY/MM/DD ') + timeFormatted; // 更早的年份
    }
}
