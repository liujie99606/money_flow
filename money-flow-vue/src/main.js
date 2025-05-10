import { createApp } from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

// 扩展dayjs插件
dayjs.extend(duration)
dayjs.extend(relativeTime)

createApp(App).mount('#app')
