import { grpcInitAddress } from '../../../enum'

/**
 * require
 */
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const storage = require('electron-localstorage')

/**
 * data
 */
const localStorage = storage.getItem('config')
let grpcUrl
if (localStorage && localStorage.grpcIp !== '') {
  grpcUrl = localStorage.grpcIp.replace(/^http:\/\//, '')
} else {
  grpcUrl = grpcInitAddress.grpcUrl
}
/**
 * 加载proto文件
 */
const packageDefinition = protoLoader.loadSync('./src/common/gRPC/finger/finger.proto', { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
const fingerprint_proto = grpc.loadPackageDefinition(packageDefinition).fingerprint
const client = new fingerprint_proto.Fingerprint(grpcUrl, grpc.credentials.createInsecure())

// 查看对应环境的指纹槽位是否有重复的
export const getRepeatedFno = json => {
  return new Promise((resolve, reject) => {
    client.getRepeatedFno(json, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 用指纹表数据覆盖指纹传感器数据
export const setFingerData = json => {
  return new Promise((resolve, reject) => {
    client.download2overwrite(json, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 获取指纹传感器状态
export const getFingerStatus = json => {
  return new Promise((resolve, reject) => {
    client.getFingerSensorStatus(json, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}
