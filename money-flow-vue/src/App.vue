<template>
  <div id="particles-container"></div>
  <div id="coins-container"></div>

  <div class="container">
    <div class="glass-panel">
      <h1 class="title animate__animated animate__fadeIn">🐎 牛马实时薪资计算器 💰</h1>

      <SetupForm v-if="!isRunning" @start-timer="startTimer" />
      
      <SalaryDisplay 
        v-else
        :current-earnings="currentEarnings"
        :elapsed-time="elapsedTime"
        :work-status="workStatus"
        :progress-percentage="progressPercentage"
        :initial-worked-seconds="initialWorkedSeconds"
        :per-second-rate="perSecondRate"
        :total-expected-earnings="totalExpectedEarnings"
        :time-until-end="timeUntilEnd"
        @stop-timer="stopTimer"
      />
    </div>
  </div>

  <footer class="text-center mt-4 py-3">
    <p>
      <a href="https://github.com/liujie99606/money_flow" target="_blank" class="github-link">
        <svg height="24" width="24" aria-hidden="true" viewBox="0 0 16 16" version="1.1">
          <path fill-rule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        GitHub: liujie99606/money_flow
      </a>
    </p>
  </footer>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { Decimal } from 'decimal.js';
import { TimerManager } from './utils/timer';
import { EffectsManager } from './utils/effects';
import SetupForm from './components/SetupForm.vue';
import SalaryDisplay from './components/SalaryDisplay.vue';

export default {
  name: 'App',
  components: {
    SetupForm,
    SalaryDisplay
  },
  
  setup() {
    // 状态
    const isRunning = ref(false);
    const currentEarnings = ref(0);
    const elapsedTime = ref(0);
    const workStatus = ref('');
    const initialWorkProgress = ref(0);
    const initialWorkedSeconds = ref(0);
    const totalExpectedEarnings = ref(0);
    const timeUntilEnd = ref(0);
    const perSecondRate = ref(0);
    
    // 计算属性
    const progressPercentage = computed(() => {
      if (isRunning.value) {
        return TimerManager.getProgressPercentage(timerConfig.value?.calculatedWorkHours);
      }
      return 0;
    });
    
    // 计时器配置
    const timerConfig = ref(null);
    
    // 开始计时
    const startTimer = (config) => {
      timerConfig.value = config;
      perSecondRate.value = config.perSecondRate;
      
      const timerState = TimerManager.startTimer(config, {
        onUpdate: handleTimerUpdate
      });
      
      isRunning.value = timerState.isRunning;
      workStatus.value = timerState.initialState.workStatus;
      initialWorkProgress.value = timerState.initialState.initialWorkProgress;
      currentEarnings.value = timerState.initialState.currentEarnings;
      initialWorkedSeconds.value = timerState.initialState.initialWorkedSeconds;
      totalExpectedEarnings.value = timerState.initialState.totalExpectedEarnings;
      elapsedTime.value = timerState.initialState.elapsedTime || 0;
    };
    
    // 停止计时
    const stopTimer = () => {
      TimerManager.stopTimer();
      isRunning.value = false;
    };
    
    // 计时器更新回调
    const handleTimerUpdate = (state) => {
      elapsedTime.value = state.elapsedTime;
      currentEarnings.value = state.currentEarnings;
      workStatus.value = state.workStatus;
      timeUntilEnd.value = state.timeUntilEnd;
    };
    
    // 初始化效果
    onMounted(() => {
      EffectsManager.applyPageAnimations();
    });
    
    return {
      isRunning,
      currentEarnings,
      elapsedTime,
      workStatus,
      initialWorkedSeconds,
      perSecondRate,
      totalExpectedEarnings,
      timeUntilEnd,
      progressPercentage,
      startTimer,
      stopTimer
    };
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/main.scss';

@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }
  
  .glass-panel {
    padding: 20px 15px;
  }
  
  .title {
    font-size: 1.4rem;
    margin-bottom: 20px;
  }
}
</style>
