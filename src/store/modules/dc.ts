/**
 * imports
 */
import { defineStore } from 'pinia'
import { dc } from '../../api'
import { Request } from '../../utils/request'
import { CompanySelectProperty, DepartmentSelectProperty, DeviceSelectProperty, GroupSelectProperty, TeamSelectProperty } from '@mew/request/dist/ms/dc'

//创建容器并导出容器
const useDcStore = defineStore('dc', {
  state: () => {
    return {}
  },
  getters: {},
  actions: {
    // device
    async deviceSelect(json: DeviceSelectProperty) {
      return await dc.device.select(json)
    },
    //group
    async groupSelect(json: GroupSelectProperty) {
      return await dc.group.select(json)
    },
    //company
    async companySelect(json: CompanySelectProperty) {
      return await dc.company.select(json)
    },
    //department
    async departmentSelect(json: DepartmentSelectProperty) {
      return await dc.department.select(json)
    },
    async departmentFind(json: DepartmentSelectProperty) {
      return await dc.department.find(json)
    },
    //team
    async teamSelect(json: TeamSelectProperty) {
      return await dc.team.select(json)
    }
  }
})

export { useDcStore, Request }
