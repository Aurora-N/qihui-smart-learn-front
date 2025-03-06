export const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;

    // 转换为秒
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
        return '刚刚';
    } else if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}分钟前`;
    } else if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)}小时前`;
    } else if (seconds < 2592000) {
        return `${Math.floor(seconds / 86400)}天前`;
    } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
};