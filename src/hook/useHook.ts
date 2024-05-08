/**
 * imports
 */
import { Request, useDcStore, useIndexStore, useUcStore } from '../store'
import { deviceType } from '../enum'

/**
 * 组织架构权限处理
 */
export async function useOrganizationPermission() {
  const user = useIndexStore()
  const grade = user.userInfo.role?.grade
  //TODO grade:1集团管理员，2:公司管理员 0:超级管理员
  switch (grade) {
    case 1:
    case 0:
    case -1:
      return await groupAndCompanyAndDepartment()
    case 2:
      return await companyAndDepartment()
  }
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
        fingerPort: item.fingerPort
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
 * 组织架构的传参处理
 */
export function userGradeJson(arr=undefined) {
  const user = useIndexStore()
  const grade = user.userInfo.role?.grade
  //TODO grade:1集团管理员，2:公司管理员 0:超级管理员
  switch (grade) {
    case 1:
    case 0:
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
