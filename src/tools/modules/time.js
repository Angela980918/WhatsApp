import dayjs from 'dayjs';

// 聊天日期
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

// 創建日期&最近聯繫日期
export const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');  // 月份从0开始，+1确保月份正确
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
