# 牛马实时薪资计算器 - 桌面版

这是牛马实时薪资计算器的桌面应用版本，基于Electron构建。

## 功能特点

- 支持月薪、日薪计算
- 实时显示已赚取金额
- 工作进度可视化
- 自动保存配置
- 跨平台支持（Windows、macOS、Linux）

## 开发环境设置

### 前置条件

- Node.js 14.x 或更高版本
- npm 7.x 或更高版本

### 安装依赖

```bash
cd electron
npm install
```

### 运行开发版本

```bash
npm run dev
```

### 构建应用

#### Windows

```bash
npm run build-win
```

#### macOS

```bash
npm run build-mac
```

#### Linux

```bash
npm run build-linux
```

构建后的应用将保存在 `out` 目录中。

## 项目结构

```
electron/
├── app/                    # 应用程序主目录
│   ├── controller/         # 控制器
│   ├── model/              # 数据模型
│   ├── public/             # 公共资源
│   │   ├── css/            # 样式文件
│   │   ├── images/         # 图片资源
│   │   ├── js/             # JavaScript文件
│   │   └── index.html      # 主页面
│   └── service/            # 服务
├── main.js                 # Electron主进程入口
├── preload.js              # 预加载脚本
├── electron.config.js      # Electron配置
└── package.json            # 项目配置
```

## 技术栈

- Electron
- Vue.js 3
- ee-core (Electron Egg)
- Bootstrap 5
- GSAP (动画)
- Day.js (时间处理)
- Decimal.js (精确计算)

## 许可证

MIT 