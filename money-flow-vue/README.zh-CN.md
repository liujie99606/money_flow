# 牛马实时薪资计算器 (Vue3版本)

一个基于Vue3、Vite和SCSS构建的实时薪资计算器，帮助您直观地了解工作期间的实时收入。

![牛马实时薪资计算器](https://cdn-icons-png.flaticon.com/512/272/272525.png)

## 功能特点

- 🕒 **实时计算**：根据您的薪资和工作时间实时计算收入
- 💰 **多种薪资类型**：支持月薪、日薪计算
- 📊 **直观显示**：进度条和统计数据让您清晰了解工作收益
- 🎉 **视觉效果**：金币掉落和粒子效果增强用户体验
- 💾 **本地存储**：自动保存您的设置，下次使用更便捷
- 📱 **响应式设计**：完美适配各种设备尺寸

## 技术栈

- **Vue3**：采用Composition API构建响应式UI
- **Vite**：快速的前端构建工具
- **SCSS**：增强的CSS预处理器
- **Decimal.js**：精确的数值计算库
- **Day.js**：轻量级的日期处理库
- **GSAP**：专业的JavaScript动画库
- **Canvas Confetti**：炫酷的庆祝效果

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 使用指南

1. 选择您的薪资类型（月薪/日薪）
2. 输入具体的薪资金额
3. 设置您的上下班时间
4. 点击"开始计时"按钮
5. 实时查看您的收入增长
6. 工作结束后点击"下班"按钮

## 项目结构

```
money-flow-vue/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.scss       # 主样式文件
│   ├── components/
│   │   ├── SetupForm.vue       # 设置表单组件
│   │   └── SalaryDisplay.vue   # 薪资显示组件
│   ├── config/
│   │   └── index.js            # 配置文件
│   ├── utils/
│   │   ├── effects.js          # 视觉效果工具
│   │   ├── storage.js          # 存储工具
│   │   └── timer.js            # 计时器工具
│   ├── App.vue                 # 主应用组件
│   └── main.js                 # 入口文件
└── index.html                  # HTML模板
```

## 从原始项目迁移

本项目是原始JavaScript版本的重构版，主要改进包括：

1. 使用Vue3框架重构，采用组件化开发
2. 使用Vite作为构建工具，提升开发体验
3. 使用SCSS替代原始CSS，增强样式管理
4. 使用Composition API实现更清晰的代码组织
5. 优化了状态管理和数据流

## 贡献

欢迎提交问题和拉取请求！

## 许可证

MIT

## 致谢

- 图标来源：[Flaticon](https://www.flaticon.com/)
- 原始项目：[liujie99606/money_flow](https://github.com/liujie99606/money_flow) 