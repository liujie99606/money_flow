<template>
  <div class="setup-form">
    <div class="form-group mb-3">
      <label for="salaryType" class="form-label">薪资类型</label>
      <select id="salaryType" class="form-select salary-select" v-model="salaryType">
        <option v-for="(type, key) in salaryTypes" :key="key" :value="key">
          {{ type.label }}
        </option>
      </select>
    </div>

    <div class="form-group mb-3">
      <label :for="salaryInputId" class="form-label">{{ salaryLabel }}</label>
      <input type="number" :id="salaryInputId" class="form-control" v-model.number="salaryAmount" min="0" step="0.01">
    </div>

    <div class="row mb-3">
      <div class="col-md-6 mb-2 mb-md-0">
        <div class="form-group">
          <label for="startTime" class="form-label">上班时间</label>
          <select id="startTime" class="form-select time-select" v-model="startTime">
            <option v-for="time in timeOptions" :key="`start-${time.value}`" :value="time.value">
              {{ time.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <label for="endTime" class="form-label">下班时间</label>
          <select id="endTime" class="form-select time-select" v-model="endTime">
            <option v-for="time in timeOptions" :key="`end-${time.value}`" :value="time.value">
              {{ time.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="work-hours-info mb-3">
      <div class="info-label">每日工作时长：</div>
      <div class="info-value">{{ calculatedWorkHours }} 小时</div>
    </div>

    <button @click="startTimer" class="btn btn-primary btn-glow" :disabled="!canStart">开始计时</button>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { AppConfig } from '../config';
import { StorageUtils } from '../utils/storage';
import { Decimal } from 'decimal.js';

export default {
  name: 'SetupForm',
  emits: ['start-timer'],
  
  setup(props, { emit }) {
    // 状态
    const salaryType = ref(AppConfig.defaults.salaryType);
    const salaryAmount = ref(AppConfig.defaults.salaryAmount);
    const startTime = ref(AppConfig.defaults.startTime);
    const endTime = ref(AppConfig.defaults.endTime);
    
    // 计算属性
    const salaryInputId = computed(() => `${salaryType.value}SalaryInput`);
    const salaryLabel = computed(() => AppConfig.salaryTypes[salaryType.value]?.label || '时薪 (元/小时)');
    const timeOptions = computed(() => AppConfig.timeOptions);
    const salaryTypes = computed(() => AppConfig.salaryTypes);
    
    // 计算实际工作时长
    const calculatedWorkHours = computed(() => {
      // 如果下班时间小于上班时间，认为是跨天（如早上8点到晚上22点）
      let hours;
      if (endTime.value >= startTime.value) {
        hours = new Decimal(endTime.value).minus(startTime.value);
      } else {
        hours = new Decimal(24).minus(startTime.value).plus(endTime.value);
      }
      
      return hours.toNumber();
    });
    
    // 将用户输入的薪资转换为时薪
    const hourlyRate = computed(() => {
      const type = salaryType.value;
      const amount = salaryAmount.value;
      
      if (!amount || amount <= 0) return 0;
      
      const salaryTypeConfig = AppConfig.salaryTypes[type];
      if (!salaryTypeConfig) return amount; // 默认为时薪
      
      // 转换为时薪，使用Decimal.js处理计算
      if (type === 'monthly') {
        // 月薪：月薪/(每月工作日*每日工作小时数)
        return new Decimal(amount).dividedBy(21.75).dividedBy(calculatedWorkHours.value).toNumber();
      } else if (type === 'daily') {
        // 日薪：日薪/每日工作小时数
        return new Decimal(amount).dividedBy(calculatedWorkHours.value).toNumber();
      } else {
        // 时薪：直接返回
        return parseFloat(amount);
      }
    });
    
    // 每秒收入
    const perSecondRate = computed(() => {
      // 使用Decimal.js计算每秒收入
      return new Decimal(hourlyRate.value).dividedBy(3600).toNumber();
    });
    
    // 是否可以开始
    const canStart = computed(() => {
      return hourlyRate.value > 0 && calculatedWorkHours.value > 0;
    });
    
    // 开始计时
    const startTimer = () => {
      if (!canStart.value) return;
      
      // 保存用户配置到localStorage
      saveSettings();
      
      // 发送开始计时事件
      emit('start-timer', {
        salaryType: salaryType.value,
        salaryAmount: salaryAmount.value,
        startTime: startTime.value,
        endTime: endTime.value,
        hourlyRate: hourlyRate.value,
        calculatedWorkHours: calculatedWorkHours.value,
        perSecondRate: perSecondRate.value
      });
    };
    
    // 保存设置
    const saveSettings = () => {
      const settings = {
        salaryType: salaryType.value,
        salaryAmount: salaryAmount.value,
        startTime: startTime.value,
        endTime: endTime.value
      };
      
      StorageUtils.saveSettings(settings);
    };
    
    // 加载设置
    const loadSettings = () => {
      const savedSettings = StorageUtils.loadSettings();
      if (savedSettings) {
        salaryType.value = savedSettings.salaryType || AppConfig.defaults.salaryType;
        salaryAmount.value = savedSettings.salaryAmount || AppConfig.defaults.salaryAmount;
        startTime.value = savedSettings.startTime || AppConfig.defaults.startTime;
        endTime.value = savedSettings.endTime || AppConfig.defaults.endTime;
      }
    };
    
    // 组件挂载时加载设置
    onMounted(() => {
      loadSettings();
    });
    
    return {
      salaryType,
      salaryAmount,
      startTime,
      endTime,
      timeOptions,
      salaryTypes,
      salaryInputId,
      salaryLabel,
      calculatedWorkHours,
      canStart,
      startTimer
    };
  }
};
</script>

<style scoped lang="scss">
.setup-form {
  padding: 20px 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  padding: 8px 12px;
  transition: all 0.3s ease;
  
  &:focus {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.3);
    color: #fff;
  }
}

.form-label {
  font-weight: 500;
  margin-bottom: 10px;
  display: block;
  text-align: left;
}

/* 下拉选择框样式 */
.salary-select,
.time-select {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  padding: 12px;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  cursor: pointer;
  
  &:focus {
    background-color: rgba(255, 255, 255, 0.15);
    border-color: var(--accent-color);
    box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.3);
    outline: none;
  }
  
  option {
    background-color: #1a1a2e;
    color: #fff;
    padding: 10px;
  }
}

/* 工作时长信息 */
.work-hours-info {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
}

.info-label {
  font-weight: 500;
  margin-right: 10px;
}

.info-value {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--accent-color);
}

/* 时间选择器行容器 */
.row {
  display: flex;
  flex-wrap: wrap;
  margin-left: -10px;
  margin-right: -10px;
  margin-bottom: 15px;
}

.col-md-6 {
  padding-left: 10px;
  padding-right: 10px;
  width: 50%;
  flex: 0 0 auto;
}

@media (max-width: 768px) {
  .col-md-6 {
    margin-bottom: 15px;
    width: 100%;
  }
}
</style> 