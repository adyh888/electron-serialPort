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
