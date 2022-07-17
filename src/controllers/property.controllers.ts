import * as s from 'zapatos/schema'
import type { components } from '../schema'
import type { QueryParams } from '../types'
import BaseController from './BaseController'

type DTO = components['schemas']['Property']

type PropertyQueryParams = QueryParams<DTO> & {
  client?: string
}

export class PropertyController extends BaseController<s.properties.Insertable, s.properties.Updatable, s.properties.JSONSelectable, s.properties.Whereable, s.properties.Table, DTO, PropertyQueryParams> {
  public static inject = ['propertyService'] as const

  deserializeInsert (dto: DTO) {
    // eslint-disable-next-line no-unused-vars
    const [businessId, clientId] = this.getIdsFromURI(dto.client)
    return {
      client_id: clientId,
      description: dto.description,
      address1: dto.address1,
      address2: dto.address1,
      city: dto.city,
      postal_code: dto.postalCode,
      country: dto.country
    }
  }

  deserializeUpdate (_Id: number, dto: DTO) {
    // eslint-disable-next-line no-unused-vars
    const [_businessId, clientId] = this.getIdsFromURI(dto.client)
    return {
      client_id: clientId,
      description: dto.description,
      address1: dto.address1,
      address2: dto.address1,
      city: dto.city,
      postal_code: dto.postalCode,
      country: dto.country
    }
  }

  serialize (model: s.properties.JSONSelectable, businessId?: number) {
    return {
      ...model,
      id: `/businesses/${businessId}/properties/${model.id}`,
      client: `/businesses/${businessId}/clients/${model.client_id}`,
      postalCode: model.postal_code
    }
  }

  getOrderBy (key: keyof DTO) {
    switch (key) {
      case 'client':
        return 'client_id'
      case 'postalCode':
        return 'postal_code'
      default:
        return key
    }
  }

  fromQuery (query: PropertyQueryParams) {
    const where: s.properties.Whereable = {}
    if (query.client) {
      // eslint-disable-next-line no-unused-vars
      const [businessId, clientId] = this.getIdsFromURI(query.client)
      where.client_id = clientId
    }
    return where
  }
}

export default PropertyController
