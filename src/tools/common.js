// 其他共用類方法
export const getLabel = (map, value, defaultLabel = '未知') => {
    const item = map.find(item => item.value === value);
    return item ? item.label : defaultLabel;
};