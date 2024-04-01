import { createRouter, createWebHashHistory } from 'vue-router'
import Setting from '../views/Setting/index/index.vue'
import Login from '../views/Login/index/index.vue'
import Home from '../views/Home/index/index.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
