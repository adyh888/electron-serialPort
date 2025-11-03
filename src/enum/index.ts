export enum deviceType {
  dummy = 'dummy' //虚拟设备
}

export enum deviceStatusEnum {
  online = 'online', //在线
  offline = 'offline' //离线
}

/**
 * grpc的请求结果
 */
export enum grpcResult {
  ACK_SUCCESS = 'ACK_SUCCESS', //成功
  ACK_FAIL = 'ACK_FAIL' //失败
}

/**
 * grpc的初始地址
 */
export enum grpcInitAddress {
  grpcFingerUrl = '172.16.10.249:50051',

  grpcFaceUrl = '172.16.10.249:50052'
}

/**
 * 版本号
 */
export enum versionEnum {
  //指纹版本
  fingerVersion = '1.0.1',
  //face版本
  faceVersion = '1.0.3',
  //APK版本
  APKVersion = '1.4.0'
}
