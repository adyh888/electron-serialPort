/**
 * 请求的事件类型
 */
export enum typeEnum {
  finger = 1,
  face = 2
}

/**
 * 请求事件的函数
 */
export enum funEnum {
  /**
   * 指纹相关
   */
  // 查看对应环境的指纹槽位是否有重复的
  getRepeatedFno = 'getRepeatedFno',
  // 用指纹表数据覆盖指纹传感器数据
  setFingerData = 'setFingerData',
  // 获取指纹传感器状态
  getFingerStatus = 'getFingerStatus',

  /**
   * 人脸相关
   */
  //根据图片注册人脸
  faceRegister = 'faceRegister'
}
