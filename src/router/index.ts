import { createRouter, createWebHashHistory } from 'vue-router'
import Setting from '../views/Setting/index/index.vue'
import Login from '../views/Login/index/index.vue'
import Home from '../views/Home/index/index.vue'
import Checkout from '../views/Home/Checkout/index.vue'
import Add from '../views/Home/Add/index.vue'
import Config from '../views/Setting/config/index.vue'
import UserList from '../views/Home/add/userList.vue'
import UploadFace from '../views/Home/face/uploadFace/index.vue'
import Camera from '../views/Home/camera/index.vue'
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
  },
  {
    path: '/userList',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/config',
    name: 'Config',
    component: Config
  },
  {
    path: '/faceUpload',
    name: 'UploadFace',
    component: UploadFace
  },
  {
    path: '/Camera',
    name: 'Camera',
    component: Camera
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  // 在这里执行你的拦截逻辑
  console.log('当前路由地址', to.path)
  next()
})

export default router
