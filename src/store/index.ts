import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 实例化pinia
const pinia = createPinia()
// 持久化插件
pinia.use(piniaPluginPersistedstate)
export { pinia }

export * from './modules'
