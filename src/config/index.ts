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

export const grpcURL = () => {
  if (storageRes && storageRes.grpcIp) {
    return storageRes.grpcIp
  } else {
    return grpcInitAddress.grpcUrl
  }
}
