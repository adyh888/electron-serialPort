/**
 * enum
 */
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
if (localStorage && localStorage.grpcFaceIp && localStorage.grpcFaceIp !== '') {
  grpcUrl = localStorage.grpcFaceIp.replace(/^http:\/\//, '')
} else {
  grpcUrl = grpcInitAddress.grpcFaceUrl
}

/**
 * 加载proto文件
 */
const packageDefinitionFace = protoLoader.loadSync('./src/common/gRPC/face/face.proto', { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
const face_proto = grpc.loadPackageDefinition(packageDefinitionFace).face
const client = new face_proto.Face(grpcUrl, grpc.credentials.createInsecure())

//根据图片注册人脸
export const faceRegister = (json: any) => {
  return new Promise((resolve, reject) => {
    client.RegisterByImage(json, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

// 清除人脸注册(face.uuid)
export const faceClear = (json: any) => {
  return new Promise((resolve, reject) => {
    client.UnRegisterFace(json, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}
