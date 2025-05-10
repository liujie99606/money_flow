// Electron IPC 通信处理
const ElectronIPC = {
    // 检查是否在Electron环境中
    isElectron() {
        return window.electron !== undefined;
    },
    
    // 初始化IPC通信
    init() {
        if (!this.isElectron()) {
            console.log('不在Electron环境中，IPC功能不可用');
            return;
        }
        
        // 注册IPC事件监听
        this.registerEvents();
        
        // 获取应用信息
        this.getAppInfo();
    },
    
    // 注册IPC事件监听
    registerEvents() {
        if (!this.isElectron()) return;
        
        // 接收应用信息
        window.electron.ipcRenderer.on('app-info', (event, info) => {
            console.log('应用信息:', info);
        });
        
        // 接收配置数据
        window.electron.ipcRenderer.on('config-loaded', (event, config) => {
            console.log('加载配置:', config);
            if (config && typeof window.onConfigLoaded === 'function') {
                window.onConfigLoaded(config);
            }
        });
        
        // 接收保存配置的菜单事件
        window.electron.ipcRenderer.on('menu-save-config', () => {
            console.log('菜单触发保存配置');
            if (window.app && typeof window.app.saveCurrentConfig === 'function') {
                window.app.saveCurrentConfig();
            }
        });
        
        // 接收显示关于对话框的事件
        window.electron.ipcRenderer.on('show-about', () => {
            console.log('显示关于对话框');
            this.showAboutDialog();
        });
    },
    
    // 获取应用信息
    getAppInfo() {
        if (!this.isElectron()) return;
        window.electron.ipcRenderer.send('get-app-info');
    },
    
    // 保存配置
    saveConfig(config) {
        if (!this.isElectron()) return;
        window.electron.ipcRenderer.send('save-config', config);
    },
    
    // 加载配置
    loadConfig() {
        if (!this.isElectron()) return;
        window.electron.ipcRenderer.send('load-config');
    },
    
    // 显示关于对话框
    showAboutDialog() {
        // 创建一个简单的关于对话框
        const aboutDialog = document.createElement('div');
        aboutDialog.className = 'about-dialog';
        aboutDialog.innerHTML = `
            <div class="about-dialog-content">
                <h2>牛马实时薪资计算器</h2>
                <p>版本: 1.0.0</p>
                <p>作者: liujie99606</p>
                <p>GitHub: <a href="https://github.com/liujie99606/money_flow" target="_blank">https://github.com/liujie99606/money_flow</a></p>
                <button id="close-about-dialog" class="btn btn-primary">关闭</button>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .about-dialog {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .about-dialog-content {
                background: rgba(30, 30, 60, 0.9);
                border-radius: 10px;
                padding: 20px;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .about-dialog-content h2 {
                margin-top: 0;
                color: #fff;
                font-size: 1.5rem;
            }
            .about-dialog-content p {
                margin: 10px 0;
                color: #ddd;
            }
            .about-dialog-content a {
                color: #00d9ff;
                text-decoration: none;
            }
            .about-dialog-content a:hover {
                text-decoration: underline;
            }
            .about-dialog-content button {
                margin-top: 15px;
            }
        `;
        
        // 添加到文档
        document.head.appendChild(style);
        document.body.appendChild(aboutDialog);
        
        // 添加关闭按钮事件
        document.getElementById('close-about-dialog').addEventListener('click', () => {
            aboutDialog.remove();
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    ElectronIPC.init();
}); 