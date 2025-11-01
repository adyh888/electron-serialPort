import { StorageCache } from '../common/StorageClass'
import { grpcInitAddress } from '../enum'

const storage = new StorageCache()
const storageRes = storage.get('config')

export const BaseURL = () => {
  if (storageRes && storageRes.serverIp) {
    return storageRes.serverIp
  } else {
    return 'http://172.16.10.40:50200'
  }
}

export const grpcFingerURL = () => {
  if (storageRes && storageRes.grpcFingerIp) {
    return storageRes.grpcFingerIp
  } else {
    return grpcInitAddress.grpcFingerUrl
  }
}

export const grpcFaceURL = () => {
  if (storageRes && storageRes.grpcFaceIp) {
    return storageRes.grpcFaceIp
  } else {
    return grpcInitAddress.grpcFaceUrl
  }
}

//grpcFingerSwitch
export const grpcFingerSwitch = () => {
  if (storageRes && storageRes.grpcFingerSwitch !== undefined) {
    return storageRes.grpcFingerSwitch
  } else {
    return true
  }
}

//grpcFaceSwitch
export const grpcFaceSwitch = () => {
  if (storageRes && storageRes.grpcFaceSwitch !== undefined) {
    return storageRes.grpcFaceSwitch
  } else {
    return true
  }
}
