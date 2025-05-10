// 本地存储管理工具
const StorageManager = {
    // 保存数据到本地存储
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`保存数据失败 [${key}]:`, error);
            return false;
        }
    },
    
    // 从本地存储获取数据
    getData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            if (data !== null) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error(`获取数据失败 [${key}]:`, error);
        }
        return defaultValue;
    },
    
    // 删除本地存储中的数据
    removeData(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`删除数据失败 [${key}]:`, error);
            return false;
        }
    },
    
    // 清空所有本地存储
    clearAll() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('清空所有数据失败:', error);
            return false;
        }
    }
}; 