import { createRouter, createWebHashHistory } from 'vue-router'
import Setting from '../views/Setting/index/index.vue'
import Login from '../views/Login/index/index.vue'
import Home from '../views/Home/index/index.vue'
import Checkout from '../views/Home/Checkout/index.vue'
import Add from '../views/Home/Add/index.vue'
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
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout
  },
  {
    path: '/add',
    name: 'Add',
    component: Add
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
