import * as s from 'zapatos/schema'
import BaseController from './BaseController'
import type { QueryParams } from '../types'

interface DTO {
  id?: number
  businessId: number
  firstName: string | null
  lastName: string | null
}

type ClientQueryParams = QueryParams<DTO>

export class ClientController extends BaseController<s.clients.Insertable, s.clients.Updatable, s.clients.JSONSelectable, s.clients.Whereable, s.clients.Table, DTO, ClientQueryParams> {
  public static inject = ['clientRepository', 'clientService'] as const;

  deserializeInsert (dto: DTO) {
    return {
      business_id: dto.businessId,
      first_name: dto.firstName,
      last_name: dto.lastName
    }
  }

  deserializeUpdate (dto: DTO) {
    return {
      business_id: dto.businessId,
      first_name: dto.firstName,
      last_name: dto.lastName
    }
  }

  serialize (model: s.clients.JSONSelectable) {
    return {
      ...model,
      businessId: model.business_id,
      firstName: model.first_name,
      lastName: model.last_name
    }
  }

  getOrderBy (key: keyof DTO) {
    switch (key) {
      case 'businessId':
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
