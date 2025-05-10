// 应用程序主逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化Vue应用
    const app = Vue.createApp({
        data() {
            return {
                // 计时器状态
                isRunning: false,
                // 薪资类型
                salaryType: 'monthly',
                // 薪资金额
                salaryAmount: 5000,
                // 上班时间
                startTime: 9,
                // 下班时间
                endTime: 18,
                // 工作天数（月薪计算用）
                workDays: 22,
                // 每秒收入
                perSecondRate: 0,
                // 每小时收入
                hourlyRate: 0,
                // 当前已赚取金额
                currentEarnings: 0,
                // 预期总收入
                totalExpectedEarnings: 0,
                // 已工作时长（秒）
                elapsedTime: 0,
                // 距离下班时间（秒）
                timeUntilEnd: 0,
                // 进度百分比
                progressPercentage: 0,
                // 工作状态
                workStatus: 'before_work',
                // 初始已工作时间（秒）
                initialWorkedSeconds: 0,
                // 系统时间
                systemTime: dayjs(),
                // 是否在Electron环境中
                isElectron: typeof window.electron !== 'undefined'
            };
        },
        computed: {
            // 薪资输入框ID
            salaryInputId() {
                return `${this.salaryType}Salary`;
            },
            // 薪资输入框标签
            salaryLabel() {
                switch (this.salaryType) {
                    case 'monthly':
                        return '月薪（元）';
                    case 'daily':
                        return '日薪（元）';
                    case 'hourly':
                        return '时薪（元）';
                    default:
                        return '薪资（元）';
                }
            },
            // 时间选项
            timeOptions() {
                const options = [];
                for (let hour = 0; hour < 24; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const value = hour + minute / 60;
                        const hourStr = hour.toString().padStart(2, '0');
                        const minuteStr = minute.toString().padStart(2, '0');
                        options.push({
                            value,
                            label: `${hourStr}:${minuteStr}`
                        });
                    }
                }
                return options;
            },
            // 计算工作时长
            calculatedWorkHours() {
                if (this.endTime < this.startTime) {
                    // 跨天情况
                    return new Decimal(24).minus(this.startTime).plus(this.endTime).toNumber().toFixed(1);
                } else {
                    return new Decimal(this.endTime).minus(this.startTime).toNumber().toFixed(1);
                }
            },
            // 格式化收入显示
            formattedEarnings() {
                return this.currentEarnings.toFixed(2);
            },
            // 总工作时间（包括初始时间）
            totalWorkedTime() {
                return this.initialWorkedSeconds + this.elapsedTime;
            },
            // 工作状态文本
            workStatusText() {
                switch (this.workStatus) {
                    case 'working':
                        return '正在工作中';
                    case 'before_work':
                        return '还未上班';
                    case 'after_work':
                        return '已经下班';
                    default:
                        return '未知状态';
                }
            },
            // 是否可以开始计时
            canStart() {
                return this.salaryAmount > 0 && this.startTime !== this.endTime;
            }
        },
        methods: {
            // 开始计时
            startTimer() {
                // 准备配置
                const config = this.getCurrentConfig();
                
                // 计算每小时收入
                this.hourlyRate = ConfigManager.calculateHourlyRate(config).toNumber();
                
                // 计算每秒收入
                this.perSecondRate = new Decimal(this.hourlyRate).dividedBy(3600).toNumber();
                
                // 保存配置
                this.saveConfig(config);
                
                // 启动计时器
                const timerResult = TimerManager.startTimer(
                    {
                        startTime: this.startTime,
                        endTime: this.endTime,
                        hourlyRate: this.hourlyRate,
                        calculatedWorkHours: parseFloat(this.calculatedWorkHours),
                        perSecondRate: this.perSecondRate,
                        onUpdate: this.onTimerUpdate
                    }
                );
                
                // 更新状态
                this.isRunning = timerResult.isRunning;
                
                // 初始化状态
                const initialState = timerResult.initialState;
                this.workStatus = initialState.workStatus;
                this.currentEarnings = initialState.currentEarnings;
                this.totalExpectedEarnings = initialState.totalExpectedEarnings;
                this.elapsedTime = initialState.elapsedTime;
                this.progressPercentage = initialState.initialWorkProgress;
                this.initialWorkedSeconds = initialState.initialWorkedSeconds;
            },
            
            // 停止计时
            stopTimer() {
                TimerManager.stopTimer();
                this.isRunning = false;
            },
            
            // 计时器更新回调
            onTimerUpdate(data) {
                this.elapsedTime = data.elapsedTime;
                this.currentEarnings = data.currentEarnings;
                this.systemTime = data.systemTime;
                this.timeUntilEnd = data.timeUntilEnd;
                this.workStatus = data.workStatus;
                this.totalExpectedEarnings = data.totalExpectedEarnings;
                
                // 计算进度
                if (this.workStatus === 'after_work') {
                    this.progressPercentage = 100;
                } else {
                    const totalSeconds = parseFloat(this.calculatedWorkHours) * 3600;
                    const workedSeconds = this.initialWorkedSeconds + this.elapsedTime;
                    this.progressPercentage = Math.min(100, (workedSeconds / totalSeconds * 100).toFixed(1));
                }
            },
            
            // 格式化时间显示
            formatTime(seconds) {
                return TimerManager.formatTime(seconds);
            },
            
            // 获取当前配置
            getCurrentConfig() {
                return {
                    salaryType: this.salaryType,
                    salaryAmount: this.salaryAmount,
                    startTime: this.startTime,
                    endTime: this.endTime,
                    workDays: this.workDays
                };
            },
            
            // 保存当前配置 (可由菜单触发)
            saveCurrentConfig() {
                const config = this.getCurrentConfig();
                this.saveConfig(config);
                
                // 显示保存成功提示
                this.showToast('配置已保存');
            },
            
            // 保存配置
            saveConfig(config) {
                // 保存到本地存储
                ConfigManager.saveConfig(config);
                
                // 如果在Electron环境中，通过IPC保存配置
                if (this.isElectron) {
                    ElectronIPC.saveConfig(config);
                }
            },
            
            // 显示提示消息
            showToast(message, duration = 2000) {
                // 创建提示元素
                const toast = document.createElement('div');
                toast.className = 'toast-message';
                toast.textContent = message;
                
                // 添加样式
                const style = document.createElement('style');
                style.textContent = `
                    .toast-message {
                        position: fixed;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: rgba(0, 217, 255, 0.8);
                        color: white;
                        padding: 10px 20px;
                        border-radius: 20px;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                        z-index: 9999;
                        animation: fadeInOut ${duration}ms ease-in-out;
                    }
                    @keyframes fadeInOut {
                        0% { opacity: 0; transform: translate(-50%, 20px); }
                        10% { opacity: 1; transform: translate(-50%, 0); }
                        90% { opacity: 1; transform: translate(-50%, 0); }
                        100% { opacity: 0; transform: translate(-50%, -20px); }
                    }
                `;
                
                // 添加到文档
                document.head.appendChild(style);
                document.body.appendChild(toast);
                
                // 自动移除
                setTimeout(() => {
                    toast.remove();
                    style.remove();
                }, duration);
            }
        },
        mounted() {
            // 加载保存的配置
            const savedConfig = ConfigManager.getConfig();
            this.salaryType = savedConfig.salaryType || 'monthly';
            this.salaryAmount = savedConfig.salaryAmount || 5000;
            this.startTime = savedConfig.startTime || 9;
            this.endTime = savedConfig.endTime || 18;
            this.workDays = savedConfig.workDays || 22;
            
            // 如果在Electron环境中，通过IPC加载配置
            if (this.isElectron) {
                ElectronIPC.loadConfig();
            }
            
            // 初始化粒子效果
            EffectsManager.initParticles();
        }
    });
    
    // 挂载Vue应用
    const mountedApp = app.mount('#app');
    
    // 将Vue实例暴露给全局，以便Electron IPC可以访问
    window.app = mountedApp;
}); 