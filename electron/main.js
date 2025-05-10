const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// 主窗口
let mainWindow;

// 创建菜单模板
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '保存配置',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('menu-save-config');
            }
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', role: 'undo' },
        { label: '重做', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', role: 'cut' },
        { label: '复制', role: 'copy' },
        { label: '粘贴', role: 'paste' },
        { label: '删除', role: 'delete' },
        { type: 'separator' },
        { label: '全选', role: 'selectAll' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { label: '重新加载', role: 'reload' },
        { label: '强制重新加载', role: 'forceReload' },
        { label: '开发者工具', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: '重置缩放', role: 'resetZoom' },
        { label: '放大', role: 'zoomIn' },
        { label: '缩小', role: 'zoomOut' },
        { type: 'separator' },
        { label: '全屏', role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { label: '最小化', role: 'minimize' },
        { label: '关闭', role: 'close' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('show-about');
            }
          }
        },
        {
          label: '访问 GitHub',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/liujie99606/money_flow');
          }
        }
      ]
    }
  ];

  return Menu.buildFromTemplate(template);
}

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    title: '牛马实时薪资计算器',
    icon: path.join(__dirname, 'app/public/images/icon.png')
  });

  // 加载应用的 index.html
  mainWindow.loadFile(path.join(__dirname, 'app/public/index.html'));

  // 根据环境打开开发者工具
  if (process.env.NODE_ENV === 'development' || process.argv.includes('--env=local')) {
    mainWindow.webContents.openDevTools();
  }

  // 当 window 被关闭，这个事件会被触发
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  // 设置应用菜单
  Menu.setApplicationMenu(createMenu());
  
  createWindow();

  app.on('activate', () => {
    // 在 macOS 上，当点击 dock 图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  
  // 设置IPC事件监听
  setupIPC();
});

// 当所有窗口都被关闭时退出
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 设置IPC事件监听
function setupIPC() {
  // 获取应用信息
  ipcMain.on('get-app-info', (event) => {
    const appInfo = {
      name: '牛马实时薪资计算器',
      version: app.getVersion(),
      platform: process.platform
    };
    event.sender.send('app-info', appInfo);
  });
  
  // 保存配置
  ipcMain.on('save-config', async (event, config) => {
    try {
      // 使用简单的文件系统存储配置
      const configPath = path.join(app.getPath('userData'), 'config.json');
      fs.writeFileSync(configPath, JSON.stringify(config));
      event.sender.send('config-saved', { success: true });
    } catch (error) {
      console.error('保存配置失败:', error);
      event.sender.send('config-saved', { success: false, error: error.message });
    }
  });
  
  // 加载配置
  ipcMain.on('load-config', async (event) => {
    try {
      // 使用简单的文件系统加载配置
      const configPath = path.join(app.getPath('userData'), 'config.json');
      
      if (fs.existsSync(configPath)) {
        const configData = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configData);
        event.sender.send('config-loaded', config);
      } else {
        event.sender.send('config-loaded', {});
      }
    } catch (error) {
      console.error('加载配置失败:', error);
      event.sender.send('config-loaded', {});
    }
  });
  
  // 窗口控制 - 最小化
  ipcMain.on('window-minimize', () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });
  
  // 窗口控制 - 最大化/还原
  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.restore();
      } else {
        mainWindow.maximize();
      }
    }
  });
  
  // 窗口控制 - 关闭
  ipcMain.on('window-close', () => {
    if (mainWindow) {
      mainWindow.close();
    }
  });
}

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。 