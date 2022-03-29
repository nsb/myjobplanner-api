import * as s from 'zapatos/schema';
import type { QueryParams } from '../types'
import BaseController from './BaseController';

interface DTO {
  id?: number
  clientId: number
  description: string | null
  address1: string | null
  address2: string | null
  city: string | null
  postalCode: string | null
  country: string | null
}

type PropertyQueryParams = QueryParams<DTO> & {
  clientId?: number
}

export class PropertyController extends BaseController<s.properties.Insertable, s.properties.JSONSelectable, s.properties.Whereable, s.properties.Table, DTO, PropertyQueryParams> {
  public static inject = ['propertyRepository'] as const;

  deserialize(dto: DTO) {
    return {
      client_id: dto.clientId,
      description: dto.description,
      address1: dto.address1,
      address2: dto.address1,
      city: dto.city,
      postal_code: dto.postalCode,
      country: dto.country
    }
  }

  serialize(model: s.properties.JSONSelectable) {
    return {
      ...model,
      clientId: model.client_id,
      postalCode: model.postal_code
    }
  }

  getOrderBy(key: keyof DTO) {
    switch (key) {
      case 'clientId':
        return 'client_id'
      case 'postalCode':
        return 'postal_code'
      default:
        return key
    }
  }

  fromQuery(query: PropertyQueryParams) {
    const where: s.properties.Whereable = {}
    if (query.clientId) {
      where.client_id = query.clientId
    }
    return where
  }
}

export default PropertyController