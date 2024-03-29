import { createRouter, createWebHashHistory } from 'vue-router'
import Setting from '../views/Setting/index/index.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Setting
  }
  // {
  //   path: '/net',
  //   name: 'Net',
  //   component: Net
  // },
  // {
  //   path: '/setting',
  //   name: 'Setting',
  //   component: Setting
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
