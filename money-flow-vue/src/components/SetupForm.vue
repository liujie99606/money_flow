<template>
  <div class="setup-form">
    <el-form :model="formData" label-position="top">
      <el-form-item label="薪资类型">
        <el-select v-model="salaryType" class="w-100">
          <el-option
            v-for="(type, key) in salaryTypes"
            :key="key"
            :label="type.label"
            :value="key"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="salaryLabel">
        <el-input-number
          v-model="salaryAmount"
          :min="0"
          :step="0.01"
          :precision="2"
          class="w-100"
        />
      </el-form-item>

      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="上班时间">
            <el-select v-model="startTime" class="w-100">
              <el-option
                v-for="time in timeOptions"
                :key="`start-${time.value}`"
                :label="time.label"
                :value="time.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下班时间">
            <el-select v-model="endTime" class="w-100">
              <el-option
                v-for="time in timeOptions"
                :key="`end-${time.value}`"
                :label="time.label"
                :value="time.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-alert
        type="info"
        :closable="false"
        class="mb-4"
      >
        <template #title>
          <div class="work-hours-info">
            <div class="info-label">每日工作时长：</div>
            <div class="info-value">{{ calculatedWorkHours }} 小时</div>
          </div>
        </template>
      </el-alert>

      <el-button
        type="primary"
        @click="startTimer"
        :disabled="!canStart"
        class="w-100"
      >
        开始计时
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue';
import { AppConfig } from '../config';
import { StorageUtils } from '../utils/storage';
import { Decimal } from 'decimal.js';

export default {
  name: 'SetupForm',
  emits: ['start-timer'],
  
  setup(props, { emit }) {
    // 表单数据
    const formData = reactive({});
    
    // 状态
    const salaryType = ref(AppConfig.defaults.salaryType);
    const salaryAmount = ref(AppConfig.defaults.salaryAmount);
    const startTime = ref(AppConfig.defaults.startTime);
    const endTime = ref(AppConfig.defaults.endTime);
    
    // 计算属性
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
      formData,
      salaryType,
      salaryAmount,
      startTime,
      endTime,
      timeOptions,
      salaryTypes,
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

.w-100 {
  width: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.work-hours-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .info-value {
    font-weight: 600;
    color: var(--el-color-primary);
  }
}

@media (max-width: 768px) {
  .setup-form {
    padding: 10px 0;
  }
}
</style> 