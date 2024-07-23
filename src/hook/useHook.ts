// @ts-nocheck
/**
 * imports
 */
import { Request, useDcStore, useIndexStore, useUcStore } from '../store'
import { deviceType, grpcResult } from '../enum'
import { asyncForEach, messageBoxShow, messageShow } from '../utils'
import { funEnum, typeEnum } from '../common/gRPC/enum'
import { BaseURL } from '../config'
import { ipcRenderer } from 'electron'
import { gRPCJson } from '../interface'
/**
 * 组织架构权限处理
 */
export async function useOrganizationPermission() {
  const user = useIndexStore()
  const grade = user.userInfo.role?.grade
  // console.log(13, grade)
  //TODO grade:1集团管理员，2:公司管理员 0:超级管理员
  switch (grade) {
    case 0:
      return await groupSelect()
    case 1:
    case -1:
      return await groupAndCompanyAndDepartment()
    case 2:
      return await companyAndDepartment()
  }
}

/**
 * 组织架构的传参
 */
export async function useOrganizationParams() {
  return new Promise((resolve, reject) => {
    const user = useIndexStore()
    let params: any = {}
    const grade = user.userInfo.role?.grade
    //TODO grade:1集团管理员，2:公司管理员 0:超级管理员
    switch (grade) {
      case 0:
        break
      case 1:
      case -1:
        params.groupId = user.userInfo.groupId
        params.companyId = user.userInfo.companyId
        break
      case 2:
        params.companyId = user.userInfo.companyId
        params.departmentId = user.userInfo.departmentId
        params.teamId = user.userInfo.teamId
    }
    resolve(params)
  })
}

/**
 * 级联树
 * 超级权限
 * 集团
 */
export async function groupSelect() {
  const user = useIndexStore()
  let groupRes = await Request(useDcStore().groupSelect, {})
  let groupResArr = []
  if (groupRes && groupRes.data.length > 0) {
    for (const item of groupRes.data) {
      groupResArr.push({
        value: item.id,
        label: item.name,
        children: item.companies.map(item2 => {
          return {
            value: item2.id,
            label: item2.name,
            children: item2.departments.map(item3 => {
              return {
                value: item3.id,
                label: item3.name,
                children: item3.teams.map(item4 => {
                  return {
                    value: item4.id,
                    label: item4.name
                  }
                })
              }
            })
          }
        })
      })
    }
  }
  user.organizationalStructureArr = groupResArr
  return groupResArr
}

/**
 * 级联树
 * 公司-组织
 */
async function companyAndDepartment() {
  const user = useIndexStore()
  let json = {
    id: user.userInfo.companyId,
    groupId: user.userInfo.groupId
  }
  let departmentRes = await departmentSelect(json)
  user.organizationalStructureArr = departmentRes
  return departmentRes
  // if (user.userInfo.companyId && user.userInfo.departmentId) {
  //   //返回公司-组织树
  //   return [
  //     {
  //       value: user.userInfo.company.id,
  //       label: user.userInfo.company.name,
  //       children: [
  //         {
  //           value: user.userInfo.department.id,
  //           label: user.userInfo.department.name
  //         }
  //       ]
  //     }
  //   ]
  // }
}

/**
 * 级联树
 * 集团-公司-组织-部门
 */
async function groupAndCompanyAndDepartment() {
  const user = useIndexStore()
  //集团-公司-组织-部门-请求
  let companyRes = await Request(useDcStore().companySelect, { groupId: user.userInfo.groupId })
  let companyResArr = []
  if (companyRes && companyRes.data.length > 0) {
    for (const item of companyRes.data) {
      companyResArr.push({
        value: item.id,
        label: item.name,
        children: await departmentSelect(item)
      })
    }
  }
  user.organizationalStructureArr = companyResArr
  return companyResArr
  // if (user.userInfo.companyId && user.userInfo.departmentId && user.userInfo.groupId && user.userInfo.teamId) {
  //   //返回集团-公司-组织-班组树
  //   return [
  //     {
  //       value: user.userInfo.group.id,
  //       label: user.userInfo.group.name,
  //       children: [
  //         {
  //           value: user.userInfo.company.id,
  //           label: user.userInfo.company.name,
  //           children: [
  //             {
  //               value: user.userInfo.department.id,
  //               label: user.userInfo.department.name,
  //               children: [
  //                 {
  //                   value: user.userInfo.team.id,
  //                   label: user.userInfo.team.name
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
}

//组织请求
async function departmentSelect(item) {
  //组织请求
  let departmentRes = await Request(useDcStore().departmentSelect, { companyId: item.id, groupId: item.groupId })
  let departmentResArr = []
  if (departmentRes && departmentRes.data.length > 0) {
    for (const item of departmentRes.data) {
      departmentResArr.push({
        value: item.id,
        label: item.name,
        children: await teamSelect(item)
      })
    }
  }
  return departmentResArr
}

//部门请求
async function teamSelect(item) {
  //部门请求
  let teamRes = await Request(useDcStore().teamSelect, {
    companyId: item.companyId,
    groupId: item.group && item.group.id,
    departmentId: item.id
  })
  let teamResArr = []
  if (teamRes && teamRes.data.length > 0) {
    for (const item of teamRes.data) {
      teamResArr.push({
        value: item.id,
        label: item.name
      })
    }
  }
  return teamResArr
}
/**
 * 获取设备的信息
 */
export async function getDeviceList(type) {
  let res = await Request(useDcStore().deviceSelect, userGradeJson())
  if (res && res.data.length > 0) {
    let mapRes = res.data.map(item => {
      return {
        label: item.name,
        value: item.id,
        type: item.deviceType?.kind,
        serviceId: item.serviceId,
        fingerPort: item.fingerPort,
        grpcPort: item.grpcPort,
        status: false
      }
    })
    switch (type) {
      case 1:
        return mapRes.filter(item => item.type !== deviceType.dummy)
      case 2:
        return mapRes
    }
  }
}

/**
 * 获取服务器设备列表的设备状态
 */
export async function getDeviceStatus() {
  let grpcJson = {
    type: typeEnum.finger,
    fun: funEnum.getFingerStatus,
    json: {
      url: BaseURL()
    }
  }
  return useRequestErrorFun(ipcRenderer.sendSync('grpc', grpcJson))
}

/**
 * 组织架构的传参处理
 */
export function userGradeJson(arr = undefined) {
  const user = useIndexStore()
  const grade = user.userInfo.role?.grade
  //TODO grade:1集团管理员，2:公司管理员 0:超级管理员
  switch (grade) {
    case 0:
      switch (arr?.length) {
        case 1:
          return { groupId: arr[0] }
        case 2:
          return { groupId: arr[0], companyId: arr[1] }
        case 3:
          return { groupId: arr[0], companyId: arr[1], departmentId: arr[2] }
        case 4:
          return { groupId: arr[0], companyId: arr[1], departmentId: arr[2], teamId: arr[3] }
      }
    case 1:
    case -1:
      switch (arr?.length) {
        case 1:
          return { groupId: user.userInfo.group?.id, companyId: arr[0] }
        case 2:
          return { groupId: user.userInfo.group?.id, companyId: arr[0], departmentId: arr[1] }
        case 3:
          return { groupId: user.userInfo.group?.id, companyId: arr[0], departmentId: arr[1], teamId: arr[2] }
      }
    case 2:
      switch (arr?.length) {
        case 1:
          return { companyId: arr[0] }
        case 2:
          return { companyId: arr[0], departmentId: arr[1] }
        case 3:
          return { companyId: arr[0], departmentId: arr[1], teamId: arr[2] }
      }
  }
}

/**
 * 获取到串口状态
 *
 */
export function getSerialPortStatus() {
  const indexStore = useIndexStore()
  return indexStore.serialPortStoreStatus
}

/**
 * 删除user用户列表
 */
export async function deleteUser(id) {
  //1：先删除设备用户
  let deviceUserRes = await Request(useUcStore().deviceUserDelete, { uid: id })
  if (deviceUserRes.code === 0) {
    //2：删除user表用户
    return await Request(useUcStore().userDelete, { id: id, isDelete: true })
  }
}

/**
 * 组织架构权限处理-自定义的值
 */
export function getGradeValue() {
  const user = useIndexStore()
  switch (user.userInfo.role?.grade) {
    case 1:
      return 'group'
    case 2:
      return 'company'
    default:
      return ''
  }
}
/**
 * 组织架构权限处理
 * @param data 组织架构数据
 */
export function getUseOrganizationPermission(data) {
  if (data.companyId && data.departmentId && data.groupId && data.teamId) {
    //返回集团-公司-组织-班组树
    return [
      {
        value: data.groupId,
        label: data.groupName,
        children: [
          {
            value: data.companyId,
            label: data.companyName,
            children: [
              {
                value: data.departmentId,
                label: data.departmentName,
                children: [
                  {
                    value: data.teamId,
                    label: data.teamName
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  } else if (data.companyId && data.departmentId) {
    //返回集团-公司-组织树
    return [
      {
        value: data.companyId,
        label: data.companyName,
        children: [
          {
            value: data.departmentId,
            label: data.departmentName
          }
        ]
      }
    ]
  }
}

/**
 * 正则判断ip是不是ipv4地址
 *
 */
export function isIpv4(ip) {
  // 这个正则表达式匹配形如"192.168.1.1"的IPv4地址
  const ipPattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipPattern.test(ip)
}

/**
 * 文件夹的验证
 */
export function useExtractFilename(str) {
  // 检查字符串是否以.png、.jpeg或.jpg结尾
  const fileExtensionRegex = /\.(?:png|jpeg|jpg)$/

  // 如果字符串包含/，则提取/后面的部分
  if (str.includes('/')) {
    const parts = str.split('/') // 使用/分割字符串
    const lastPart = parts[parts.length - 1] // 获取最后一个部分

    // 检查最后一个部分是否以.png、.jpeg或.jpg结尾
    if (fileExtensionRegex.test(lastPart)) {
      return lastPart // 返回/后面的文件名
    }
  } else {
    // 如果没有/，则直接检查整个字符串是否以.png、.jpeg或.jpg结尾
    if (fileExtensionRegex.test(str)) {
      return str // 返回整个字符串作为文件名
    }
  }

  // 如果字符串不符合要求，则返回null或空字符串
  return null
}

/**
 * 检测文件夹下检测
 */
export function useTraverseFolderForImages(folder) {
  // 遍历文件夹中的每一项（可能是文件或子文件夹）
  for (const entryName in folder.files) {
    if (folder.files.hasOwnProperty(entryName)) {
      const file = folder.file(entryName)

      // 检查文件扩展名是否是图片格式
      const ext = file.name.split('.').pop().toLowerCase()
      if (['png', 'jpg', 'jpeg'].includes(ext)) {
        // 这是一个图片文件，你可以在这里进行处理，比如获取文件内容等
        file.async('blob').then(function (blob) {
          // blob 是文件的 Blob 对象，你可以根据需要进行处理
          console.log('Found image:', file.name, blob)
          // 例如，你可以创建一个 URL 来预览图片：
          const url = URL.createObjectURL(blob)
          console.log('Image URL:', url)
          // 记得在不再需要 URL 时释放它
          // URL.revokeObjectURL(url);
        })
      }
    }
  }

  // 如果文件夹还有子文件夹，递归遍历它们
  if (folder.folders) {
    for (const subfolderName in folder.folders) {
      if (folder.folders.hasOwnProperty(subfolderName)) {
        const subfolder = folder.folder(subfolderName)
        traverseFolderForImages(subfolder) // 递归调用
      }
    }
  }
}

/**
 * 提取文件名称的姓名和工号
 */
export function useExtractNamesAndNumbers(fileNames) {
  return new Promise(resolve => {
    const names = []
    const employeeNos = []

    for (let i = 0; i < fileNames.length; i++) {
      const fileName = fileNames[i]
      // 检查文件扩展名是否为.png、.jpg或.jpeg
      if (/\.(?:png|jpg|jpeg)$/.test(fileName)) {
        // 移除文件扩展名
        const baseName = fileName.replace(/\..+$/, '')

        // 使用_分割文件名
        const parts = baseName.split('_')

        // 检查_分割后的数组是否至少有两个部分
        if (parts.length >= 2) {
          // 提取名字（第一个_之前的部分）
          const name = parts.shift() // shift移除并返回数组的第一个元素
          names.push(name)

          // 提取员工编号（剩余部分连接起来）
          const employeeNo = parts.join('_')
          employeeNos.push(employeeNo)
        }
      } else {
        messageShow('检测压缩包里的文件有不支持的格式，支持图片格式(jpg,jpeg,png)', 'error')
        break
      }
    }

    // 检查names数组中是否有重复的元素
    let checkArrRes = checkForDuplicates(names)
    if (checkArrRes) {
      resolve(false)
      return
    }
    // 检查employeeNos数组中的每个元素是否只包含字母、数字或字母加数字
    for (let i = 0; i < employeeNos.length; i++) {
      const employeeNo = employeeNos[i]
      if (!/^[a-zA-Z0-9]+$/.test(employeeNo)) {
        // console.log('Invalid Employee Number:', employeeNo, 'at index', i);
        messageBoxShow('提示', `工号只包含字母、数字或字母加数字，不支持的数据是:${employeeNo}`, 'error', 2000)
        resolve(false)
        break
      }
    }

    resolve(true)
  })
}

function checkForDuplicates(arr) {
  const uniqueElements = new Set()

  // 遍历数组
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i]

    // 如果元素已经存在于Set中，说明有重复
    if (uniqueElements.has(element)) {
      console.log('数组中有重复的元素', element)
      messageBoxShow('提示', `姓名中有重复的数据,重复的姓名是:${element}`, 'error', 2000)
      return true // 找到了重复，可以立即返回
    }

    // 如果元素不存在于Set中，则添加到Set中
    uniqueElements.add(element)
  }

  // 如果没有找到重复的元素，则打印没有重复的消息
  // console.log("数组中没有重复的元素");
  return false
}

/**
 * base64转blob-image
 */
export function base64ToBlob(base64) {
  // 移除URL的头部（data:image/jpeg;base64,）
  let base64Data = base64.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
  // 使用atob和Uint8Array将base64字符串转换为二进制数组
  let binaryData = window.atob(base64Data)
  let arrayBuffer = new ArrayBuffer(binaryData.length)
  let uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i)
  }

  // 创建一个Blob对象
  let blob = new Blob([uint8Array], { type: 'image/jpeg' })

  // 创建一个指向Blob的URL
  let blobUrl = URL.createObjectURL(blob)

  // 在控制台打印Blob URL，但请注意，这本身不会预览图像
  const imgFile = {
    file: blob,
    src: blobUrl
  }
  return imgFile
  // let res = saveAs(blob, 'image.jpg')
  // console.log(518, res)
}

/**
 * 图片file-Blob转base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // resolve(reader.result as string) // result 是 data URL，它包含前缀（如 "data:image/jpeg;base64,"）和 Base64 编码的字符串
      // 读取结果是一个data URL，我们需要移除前缀以获取纯Base64字符串
      const base64Data = reader.result as string
      const base64Index = base64Data.indexOf('base64,')
      if (base64Index >= 0) {
        // 提取base64编码部分
        const base64 = base64Data.substring(base64Index + 7)
        resolve(base64)
      } else {
        reject(new Error('The returned data could not be parsed as Base64.'))
      }
    }
    reader.onerror = error => {
      reject(error)
    }
  })
}

/**
 * 把本地相同槽位的数据赋值为null
 */
export async function useSetFingerNull(deviceId: string) {
  let fingerRes = await Request(useUcStore().fingerSelect, { deviceId })
  if (fingerRes.data.length > 0) {
    let noArr = noRepetitionFun(fingerRes.data)
    if (noArr.length > 0) {
      await asyncForEach(noArr, async item => {
        //相同的no 赋值为null
        await Request(useUcStore().fingerUpdate, { id: item.id, no: null, deviceId: deviceId })
      })
    }
  }
}

/**
 * 筛选数组中-no为相同的值
 */
function noRepetitionFun(arr) {
  // 将对象按照 no 值进行分组
  let groupedByNo = arr.reduce((acc, obj) => {
    let key = obj.no
    // 排除 no 为 null 的对象
    if (!acc[key] && key !== null) {
      acc[key] = []
    }
    // 只对 no 不为 null 的对象进行分组
    if (key !== null) {
      acc[key].push(obj)
    }
    return acc
  }, {})

  // 筛选出包含相同 no 值的对象
  return Object.values(groupedByNo)
    .filter(group => group.length > 1)
    .flat()
}

/**
 * 指纹的同步下载逻辑重写
 * @param arr 本地指纹数据库数据
 * @param fingerObj 指纹类的对象
 * @param fingerArr 指纹模块的数据
 */
export async function useSyncDownFinger(arr, fingerObj, fingerArr) {
  //过滤本地数据库中的指纹数据
  //1: 过滤槽位!==null的数据并且fingerprint!==null
  let noArr = arr.filter(item => item.no !== null && item.fingerprint !== null)
  //2: 过滤槽位===null的数据并且fingerprint!==null
  let nullArr = arr.filter(item => item.no === null && item.fingerprint !== null)
  // 删除指纹模块的指纹
  if (fingerArr.length > 0) {
    await fingerObj.fingerprintClear()
  }
  //把本地的指纹数据上传到模块中
  await asyncForEach(noArr, async item => {
    const addFingerRes = await fingerObj.downloadFeatureAndSaveToDsp(item.no, item.fingerprint)
    console.log(592, addFingerRes)
  })
  //把null的数据更新到指纹模块里
  await asyncForEach(nullArr, async item => {
    console.log(596, item.fingerprint)
    const res = await fingerObj.downloadFeatureAndCompareOneToMore(item.fingerprint)
    console.log(598, res)
    if (res.result === 'ACK_NOUSER' || res.result === 'ACK_SUCCESS') {
      //如果不存在就下载 到最小的空槽位
      const downloadRes = await fingerObj.downloadFeatureAndSaveToDsp(await fingerObj.getEmptyFno(), item.fingerprint)
      console.log(602, downloadRes)
      //TODO 单个更新本地数据库
      if (downloadRes.result === 'ACK_SUCCESS') {
        await Request(useUcStore().fingerUpdate, { id: item.id, no: downloadRes.total, deviceId: item.deviceId })
      }
    }
  })
}

/**
 * 更新本地服务器人脸接口并新增face表的信息
 */
export const useLocalFaceUpdateFun = async (json: any) => {
  //先自检face表有没有数据
  let faceSelectRes = await Request(useUcStore().userFaceSelect, { id: json.faceId })
  // console.log(647, faceSelectRes)
  if (faceSelectRes && faceSelectRes.data && faceSelectRes.data.length === 0) {
    //人脸设备插入成功-往本地数据库插入
    let faceJson = {
      id: json.faceId,
      uuid: json.uuid,
      imageData: await fileToBase64(json.file)
    }
    //本地数据库新增数据
    await Request(useUcStore().userFaceInsert, faceJson)
  }
  //更新本地数据库信息
  return await Request(useUcStore().userUpdate, { id: json.uid, faceId: json.faceId })
}

/**
 * 请求错误提示
 */
export const useRequestErrorFun = (res: any) => {
  if (res.result === grpcResult.ACK_FAIL) {
    messageShow(`GRPC请求错误,${res.error}`, 'error')
    return
  }
  if (res.result === grpcResult.ACK_SUCCESS || res.result !== '') {
    return res
  }
}

/**
 * 获取查看对应环境的指纹槽位是否有重复的
 */
export const useGetRepeatedFno = async (json: any) => {
  let grpcJson = {
    type: typeEnum.finger,
    fun: funEnum.getRepeatedFno,
    json
  }
  return useRequestErrorFun(ipcRenderer.sendSync('grpc', grpcJson))
}

/**
 * 用指纹表数据覆盖指纹传感器数据
 */
export const useSetFingerData = async (json: any) => {
  let grpcJson = {
    type: typeEnum.finger,
    fun: funEnum.setFingerData,
    json
  }
  return useRequestErrorFun(ipcRenderer.sendSync('grpc', grpcJson))
}

/**
 * 封装的GRPC调用-main
 * @param grpcJson
 * 格式：
 * 1. type: 请求的事件类型
 * 2. fun: 请求的事件
 * 3. json: 请求的参数
 * grpcJson = {
 *     type: typeEnum.finger,
 *     fun: funEnum.getFingerStatus,
 *     json
 *   }
 */
export const useGrpcFun = async (grpcJson: gRPCJson) => {
  return useRequestErrorFun(ipcRenderer.sendSync('grpc', grpcJson))
}

/**
 * 删除人脸-grpc调用
 *@param uuid-face-uuid
 */
export const useFaceClear = async uuid => {
  let grpcJson = {
    type: typeEnum.face,
    fun: funEnum.faceClear,
    json: {
      uuid
    }
  }
  return await useGrpcFun(grpcJson)
}

/**
 * 注册人脸-grpc调用
 */
export const useFaceRegister = async (json: any) => {
  //正则匹配ID和IP
  const regexId = /ID:([0-9]+)/
  const regexIp = /IP:([\d.]+)/
  const regex = /:([^:]*)$/
  let grpcJson = {
    type: typeEnum.face,
    fun: funEnum.faceRegister,
    json: {
      name: json.name,
      uid: json.uid,
      imageData: await fileToBase64(json.file)
    }
  }
  let resArrObj = {
    deviceListFail: [],
    deviceListSuccess: []
  }
  let gRPCRes = await useGrpcFun(grpcJson)
  // console.log(469, gRPCRes)
  if (gRPCRes.result !== '') {
    let res = JSON.parse(gRPCRes.result)
    // console.log(464, res)
    if (res.length > 0) {
      res.forEach(item => {
        const resMatch = item.result.match(regex) ?? []
        if (resMatch && resMatch.length > 0 && resMatch[1] === grpcResult.ACK_FAIL && item.error !== '') {
          let deviceId = item.result.match(regexId)
          let deviceIp = item.result.match(regexIp)
          if (deviceId && deviceId[1] && deviceIp && deviceIp[1]) {
            let obj = { deviceId: deviceId[1], deviceIp: deviceIp[1], error: item.error }
            resArrObj.deviceListFail.push(obj)
          }
        }
        if (resMatch && resMatch.length > 0 && resMatch[1] === grpcResult.ACK_SUCCESS) {
          let deviceId = item.result.match(regexId)
          let deviceIp = item.result.match(regexIp)
          if (deviceId && deviceId[1] && deviceIp && deviceIp[1]) {
            let obj = { deviceId: deviceId[1], deviceIp: deviceIp[1], success: item.error }
            resArrObj.deviceListSuccess.push(obj)
          }
        }
      })
    }
  }
  return resArrObj
}
