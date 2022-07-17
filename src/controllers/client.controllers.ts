import * as s from 'zapatos/schema'
import type { components } from '../schema'
import BaseController from './BaseController'
import type { QueryParams } from '../types'

type DTO = components['schemas']['Client']

type ClientQueryParams = QueryParams<DTO>

export class ClientController extends BaseController<s.clients.Insertable, s.clients.Updatable, s.clients.JSONSelectable, s.clients.Whereable, s.clients.Table, DTO, ClientQueryParams> {
  public static inject = ['clientService'] as const

  deserializeInsert (dto: DTO) {
    const [businessId] = this.getIdsFromURI(dto.business)
    if (!businessId) {
      throw new Error('Invalid business Id')
    }

    return {
      business_id: businessId,
      first_name: dto.firstName,
      last_name: dto.lastName
    }
  }

  deserializeUpdate (_Id: number, dto: DTO) {
    return this.deserializeInsert(dto)
  }

  serialize (model: s.clients.JSONSelectable) {
    return {
      ...model,
      id: `/businesses/${model.business_id}/clients/${model.id}`,
      business: `/businesses/${model.business_id}`,
      firstName: model.first_name,
      lastName: model.last_name
    }
  }

  validate (
    _userId: string,
    model: s.clients.Insertable | s.clients.Updatable,
    businessId: number
  ) {
    return model.business_id === businessId
  }

  getOrderBy (key: keyof DTO) {
    switch (key) {
      case 'business':
        return 'business_id'
      case 'firstName':
        return 'first_name'
      case 'lastName':
        return 'last_name'
      default:
        return key
    }
  }

  fromQuery (query: ClientQueryParams) {
    const where: s.clients.Whereable = {}
    return where
  }
}

export default ClientController
