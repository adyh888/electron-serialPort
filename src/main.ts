import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './samples/node-api'
import { pinia } from './store'
// createApp(App)
//   .mount('#app')
//   .$nextTick(() => {
//     postMessage({ payload: 'removeLoading' }, '*')
//   })

const app = createApp(App)
// 使用Pinia插件
app.use(pinia)

// 挂载应用到DOM元素
app.mount('#app')

// 在Vue应用挂载后的下一个tick中发送消息
app.$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
