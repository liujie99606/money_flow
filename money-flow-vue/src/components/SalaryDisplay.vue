<template>
  <div class="salary-display">
    <div class="current-earning-container">
      <h2 class="mb-2">当前已赚取</h2>
      <div class="earning-value">¥{{ formattedEarnings }}</div>
    </div>

    <div class="work-status-badge" :class="'status-' + workStatus">
      {{ workStatusText }}
    </div>

    <div class="progress-container mb-3">
      <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated"
             :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">{{ progressPercentage }}%</div>
    </div>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-label">已工作时长</div>
        <div class="stat-value">{{ formatTime(totalWorkedTime) }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">下班倒计时</div>
        <div class="stat-value">{{ formatTime(timeUntilEnd) }}</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">每秒收入</div>
        <div class="stat-value">¥{{ perSecondRate.toFixed(4) }}/秒</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">预计总收入</div>
        <div class="stat-value">¥{{ totalExpectedEarnings.toFixed(2) }}</div>
      </div>
    </div>

    <button @click="stopTimer" class="btn btn-danger btn-glow mt-4">下班</button>
  </div>
</template>

<script>
import { computed } from 'vue';
import { Decimal } from 'decimal.js';
import { TimerManager } from '../utils/timer';

export default {
  name: 'SalaryDisplay',
  emits: ['stop-timer'],
  
  props: {
    currentEarnings: {
      type: Number,
      default: 0
    },
    elapsedTime: {
      type: Number,
      default: 0
    },
    workStatus: {
      type: String,
      default: 'working'
    },
    progressPercentage: {
      type: Number,
      default: 0
    },
    initialWorkedSeconds: {
      type: Number,
      default: 0
    },
    perSecondRate: {
      type: Number,
      default: 0
    },
    totalExpectedEarnings: {
      type: Number,
      default: 0
    },
    timeUntilEnd: {
      type: Number,
      default: 0
    }
  },
  
  setup(props, { emit }) {
    // 格式化收入显示
    const formattedEarnings = computed(() => {
      // 使用Decimal.js格式化，确保小数点后两位
      return new Decimal(props.currentEarnings).toFixed(2);
    });
    
    // 工作状态显示文本
    const workStatusText = computed(() => {
      switch(props.workStatus) {
        case 'before_work':
          return '还未上班';
        case 'working':
          return '正在工作中';
        case 'after_work':
          return '已经下班了';
        default:
          return '';
      }
    });
    
    // 总的已工作时间（包括初始已工作时间和计时器记录的时间）
    const totalWorkedTime = computed(() => {
      return new Decimal(props.initialWorkedSeconds).plus(props.elapsedTime).toNumber();
    });
    
    // 停止计时
    const stopTimer = () => {
      emit('stop-timer');
    };
    
    // 格式化时间显示
    const formatTime = (seconds) => {
      return TimerManager.formatTime(seconds);
    };
    
    return {
      formattedEarnings,
      workStatusText,
      totalWorkedTime,
      stopTimer,
      formatTime
    };
  }
};
</script>

<style scoped lang="scss">
.salary-display {
  padding: 20px 0;
}

.earning-value {
  font-size: 4rem;
  font-weight: bold;
  margin: 5px 0 20px;
  color: #ffde59;
  background: linear-gradient(45deg, #ffde59, #ff914d);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 0 20px rgba(255, 222, 89, 0.5);
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.progress-container {
  position: relative;
  margin: 20px 0;
}

.progress {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  height: 20px;
}

.progress-bar {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  transition: width 0.5s ease;
  height: 100%;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.stat-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: var(--accent-color);
  }
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 600;
}

.work-status-badge {
  display: inline-block;
  padding: 5px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 15px;
  
  &.status-working {
    background: linear-gradient(45deg, #4CAF50, #8BC34A);
  }
  
  &.status-before_work {
    background: linear-gradient(45deg, #FF9800, #FFC107);
  }
  
  &.status-after_work {
    background: linear-gradient(45deg, #2196F3, #03A9F4);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .earning-value {
    font-size: 2.5rem;
  }
}
</style> 