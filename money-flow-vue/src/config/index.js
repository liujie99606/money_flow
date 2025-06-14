// 配置文件 - 包含应用程序的基础数据和配置选项

// 时间选项生成函数
function generateTimeOptions() {
  const options = [];
  
  // 生成0-24小时的选项，每半小时一个选项
  for (let hour = 0; hour < 24; hour++) {
    // 整点
    options.push({
      value: hour,
      label: `${hour.toString().padStart(2, '0')}:00`
    });
    
    // 半点
    options.push({
      value: hour + 0.5,
      label: `${hour.toString().padStart(2, '0')}:30`
    });
  }
  
  return options;
}

// 应用配置对象
export const AppConfig = {
  // 默认配置
  defaults: {
    salaryType: 'monthly',
    salaryAmount: 0,
    startTime: 8,
    endTime: 16,
  },
  
  // 预生成的时间选项
  timeOptions: generateTimeOptions(),
  
  // 可用的薪资类型配置
  salaryTypes: {
    'monthly': {
      label: '月薪 (元/月)'
    },
    'daily': {
      label: '日薪 (元/天)'
    },
    /* 注释掉时薪选项
    'hourly': {
      label: '时薪 (元/小时)'
    }
    */
  }
}; 