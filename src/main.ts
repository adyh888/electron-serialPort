import { createApp, nextTick } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import './samples/node-api'
import 'element-plus/dist/index.css'
import { pinia } from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// createApp(App)
//   .mount('#app')
//   .$nextTick(() => {
//     postMessage({ payload: 'removeLoading' }, '*')
//   })

const app = createApp(App)
// 使用Pinia插件
app.use(pinia)

//挂载路由
app.use(router)
// 挂载应用到DOM元素
app.mount('#app')

// 注册ElementPlusIconsVue图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 在Vue应用挂载后的下一个tick中发送消息
nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
}).then(() => {})
