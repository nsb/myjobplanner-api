import * as s from 'zapatos/schema'
import type { components } from '../schema'
import BaseController from './BaseController'
import type { QueryParams } from '../types'

type DTO = components['schemas']['Employee']

type EmployeeQueryParams = QueryParams<DTO>

export class EmployeeController extends BaseController<
  s.employees.Insertable,
  s.employees.Updatable,
  s.employees.JSONSelectable,
  s.employees.Whereable,
  s.employees.Table, DTO,
  EmployeeQueryParams> {
  public static inject = ['employeeService'] as const

  deserializeInsert (dto: DTO) {
    const [businessId] = this.getIdsFromURI(dto.business)
    if (!businessId) {
      throw new Error('Invalid business Id')
    }

    return {
      business_id: businessId,
      role: dto.role,
      user_id: ''
    }
  }

  deserializeUpdate (_Id: number, dto: DTO) {
    return this.deserializeInsert(dto)
  }

  serialize (model: s.employees.JSONSelectable) {
    return {
      ...model,
      id: `/businesses/${model.business_id}/employees/${model.id}`,
      user: '',
      business: `/businesses/${model.business_id}`
    }
  }

  validate (
    _userId: string,
    model: s.employees.Insertable | s.employees.Updatable,
    businessId: number
  ) {
    return model.business_id === businessId
  }

  getOrderBy (key: keyof DTO) {
    switch (key) {
      case 'business':
        return 'business_id'
      case 'user':
        return 'user_id'
      default:
        return key
    }
  }

  fromQuery (query: EmployeeQueryParams) {
    const where: s.employees.Whereable = {}
    return where
  }
}

export default EmployeeController
