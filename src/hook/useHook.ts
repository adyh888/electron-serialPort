/**
 * imports
 */
import { useIndexStore } from '../store'

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
