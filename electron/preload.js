// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// 安全地暴露Electron API给渲染进程
contextBridge.exposeInMainWorld('electron', {
    // IPC通信
    ipcRenderer: {
        // 发送消息到主进程
        send: (channel, data) => {
            // 白名单通道
            const validChannels = [
                'get-app-info',
                'save-config',
                'load-config',
                'window-minimize',
                'window-maximize',
                'window-close'
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        // 从主进程接收消息
        on: (channel, func) => {
            // 白名单通道
            const validChannels = [
                'app-info',
                'config-loaded',
                'config-saved',
                'menu-save-config',
                'show-about'
            ];
            if (validChannels.includes(channel)) {
                // 移除所有现有监听器，防止重复
                ipcRenderer.removeAllListeners(channel);
                // 添加新的监听器
                ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
            }
        },
        // 一次性从主进程接收消息
        once: (channel, func) => {
            // 白名单通道
            const validChannels = [
                'app-info',
                'config-loaded',
                'config-saved'
            ];
            if (validChannels.includes(channel)) {
                ipcRenderer.once(channel, (event, ...args) => func(event, ...args));
            }
        }
    },
    
    // 应用信息
    app: {
        name: '牛马实时薪资计算器',
        version: '1.0.0'
    }
}); 