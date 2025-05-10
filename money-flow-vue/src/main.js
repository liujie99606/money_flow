import { createApp } from 'vue'
import App from './App.vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/styles/element-custom.scss'

// 扩展dayjs插件
dayjs.extend(duration)
dayjs.extend(relativeTime)

createApp(App).mount('#app')
