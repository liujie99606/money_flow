# 薪资计算器

这是一个实时薪资计算器，可以根据用户的薪资类型（月薪、日薪或时薪）和工作时间，实时计算当前已经赚取的金额。

## 项目结构

```
salary/
├── index.html      # 主页面
├── style.css       # 样式文件
├── script.js       # 旧版单文件脚本（已不再使用）
└── js/             # 分离的JavaScript文件
    ├── app.js      # 主应用入口
    ├── config.js   # 配置和常量
    ├── effects.js  # 视觉效果
    ├── storage.js  # 本地存储功能
    └── timer.js    # 计时器功能
```

## 功能模块

项目已被重构为多文件结构：

1. **config.js** - 包含应用程序的基本配置和常量数据
2. **storage.js** - 处理本地存储（localStorage）相关功能
3. **effects.js** - 负责所有视觉特效和动画
4. **timer.js** - 处理计时器逻辑和工作状态计算
5. **app.js** - Vue应用程序主入口，整合以上所有模块

## 使用说明

1. 选择薪资类型（月薪、日薪或时薪）
2. 输入相应的薪资金额
3. 设置工作的开始时间和结束时间
4. 点击"开始计时"按钮，开始实时计算
5. 根据当前时间和设置的工作时间，系统会自动计算进度和收入

## 特殊效果

- 每增加一元会掉落金币和显示小范围的庆祝效果
- 每增加十元会有中等范围的庆祝效果
- 每增加一百元会有大范围的庆祝效果
- 工作状态会根据当前时间自动判断（未上班、工作中、已下班）
- 动态进度条显示工作进度百分比