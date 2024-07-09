/**
 * imports
 */
import { defineStore } from 'pinia'
import { uc } from '../../api'
import { Request } from '../../utils/request'
import { DeviceUserDeleteProperty, DeviceUserSelectProperty, FaceInsertProperty, FingerSelectProperty, FingerUpdateProperty, UserDeleteProperty, UserSelectProperty, UserUpdateProperty } from '@mew/request/dist/ms/uc'

//创建容器并导出容器
const useUcStore = defineStore('uc', {
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    // 用户信息
    async userSelect(json: UserSelectProperty) {
      return await uc.user.select(json)
    },
    async userDelete(json: UserDeleteProperty) {
      return await uc.user.delete(json)
    },
    async userUpdate(json: UserUpdateProperty) {
      return await uc.user.update(json)
    },
    async userFind(json: UserSelectProperty) {
      return await uc.user.find(json)
    },
    //face人脸信息
    async userFaceInsert(json: FaceInsertProperty) {
      return await uc.face.insert(json)
    },
    async userFaceSelect(json: FaceInsertProperty) {
      return await uc.face.select(json)
    },
    //设备用户信息
    async deviceUserSelect(json: DeviceUserSelectProperty) {
      return await uc.device_user.select(json)
    },
    async deviceUserDelete(json: DeviceUserDeleteProperty) {
      return await uc.device_user.delete(json)
    },
    //finger信息
    async fingerSelect(json: FingerSelectProperty) {
      return await uc.finger.select(json)
    },
    async fingerUpdate(json: FingerUpdateProperty) {
      return await uc.finger.update(json)
    },
    //用户注册
    async userRegister(json: any) {
      return await uc.registerUser(json)
    }
  }
})

export { useUcStore, Request }
