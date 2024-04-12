/**
 * imports
 */
import { Request, useDcStore, useIndexStore, useUcStore } from '../store'
import { deviceType } from '../enum'

/**
 * 组织架构权限处理
 */
export function useOrganizationPermission() {
  const user = useIndexStore()
  const grade = user.userInfo.role?.grade
  //TODO grade:1集团管理员，2:公司管理员 0:超级管理员
  switch (grade) {
    case 1:
    case 0:
    case -1:
      return groupAndCompanyAndDepartment()
    case 2:
      return companyAndDepartment()
  }
}

/**
 * 级联树
 * 公司-组织
 */
function companyAndDepartment() {
  const user = useIndexStore()
  if (user.userInfo.companyId && user.userInfo.departmentId) {
    //返回公司-组织树
    return [
      {
        value: user.userInfo.company.id,
        label: user.userInfo.company.name,
        children: [
          {
            value: user.userInfo.department.id,
            label: user.userInfo.department.name
          }
        ]
      }
    ]
  }
}

/**
 * 级联树
 * 集团-公司-组织-部门
 */
function groupAndCompanyAndDepartment() {
  const user = useIndexStore()
  if (user.userInfo.companyId && user.userInfo.departmentId && user.userInfo.groupId && user.userInfo.teamId) {
    //返回集团-公司-组织-班组树
    return [
      {
        value: user.userInfo.group.id,
        label: user.userInfo.group.name,
        children: [
          {
            value: user.userInfo.company.id,
            label: user.userInfo.company.name,
            children: [
              {
                value: user.userInfo.department.id,
                label: user.userInfo.department.name,
                children: [
                  {
                    value: user.userInfo.team.id,
                    label: user.userInfo.team.name
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
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
export function userGradeJson() {
  const user = useIndexStore()
  const grade = user.userInfo.role?.grade
  //TODO grade:1集团管理员，2:公司管理员 0:超级管理员
  switch (grade) {
    case 1:
    case 0:
    case -1:
      return {
        groupId: user.userInfo.group?.id,
        companyId: user.userInfo.company?.id,
        departmentId: user.userInfo.department?.id,
        teamId: user.userInfo.team?.id
      }
    case 2:
      return {
        companyId: user.userInfo.company?.id,
        departmentId: user.userInfo.department?.id
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
