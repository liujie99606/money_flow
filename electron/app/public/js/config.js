// 配置管理工具
const ConfigManager = {
    // 默认配置
    defaultConfig: {
        salaryType: 'monthly',
        salaryAmount: 5000,
        startTime: 9,
        endTime: 18,
        workDays: 22
    },
    
    // 获取配置
    getConfig() {
        try {
            // 尝试从localStorage获取配置
            const savedConfig = localStorage.getItem('userConfig');
            if (savedConfig) {
                return JSON.parse(savedConfig);
            }
        } catch (error) {
            console.error('获取配置失败:', error);
        }
        
        // 如果没有保存的配置或解析失败，返回默认配置
        return this.defaultConfig;
    },
    
    // 保存配置
    saveConfig(config) {
        try {
            localStorage.setItem('userConfig', JSON.stringify(config));
            
            // 如果在Electron环境中，还可以通过IPC保存到文件系统
            if (window.electron) {
                window.electron.ipcRenderer.send('save-config', config);
            }
            
            return true;
        } catch (error) {
            console.error('保存配置失败:', error);
            return false;
        }
    },
    
    // 计算每小时收入
    calculateHourlyRate(config) {
        const { salaryType, salaryAmount, workDays } = config;
        
        if (salaryType === 'hourly') {
            // 如果是时薪，直接返回
            return new Decimal(salaryAmount);
        } else if (salaryType === 'daily') {
            // 如果是日薪，除以工作小时数
            const workHours = this.calculateWorkHours(config);
            return new Decimal(salaryAmount).dividedBy(workHours);
        } else {
            // 如果是月薪，先计算日薪，再计算时薪
            const dailySalary = new Decimal(salaryAmount).dividedBy(workDays);
            const workHours = this.calculateWorkHours(config);
            return dailySalary.dividedBy(workHours);
        }
    },
    
    // 计算工作时长（小时）
    calculateWorkHours(config) {
        const { startTime, endTime } = config;
        
        // 处理跨天的情况
        if (endTime < startTime) {
            return new Decimal(24).minus(startTime).plus(endTime);
        } else {
            return new Decimal(endTime).minus(startTime);
        }
    }
}; 