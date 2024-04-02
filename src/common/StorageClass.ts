export class StorageCache {
  constructor() {}

  set(key: string, data: any) {
    try {
      if (data) {
        localStorage.setItem(key, JSON.stringify(data))
      }
    } catch (e) {
      throw new Error(`本地储存错误,${e}`)
    }
  }

  get(key: string) {
    try {
      const storageInfo = localStorage.getItem(key)
      if (storageInfo) {
        return JSON.parse(storageInfo)
      }
    } catch (e) {
      throw new Error(`获取本地储存错误,${e}`)
    }
  }

  remove(key: string) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      throw new Error(`删除本地储存错误,${e}`)
    }
  }

  clear() {
    try {
      localStorage.clear()
    } catch (e) {
      throw new Error(`移除本地储存错误,${e}`)
    }
  }
}
