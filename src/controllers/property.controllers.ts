import * as s from 'zapatos/schema';
import type { QueryParams, ITransformer } from '../types'
import BaseController from './BaseController';

interface PropertyDTO {
  id?: number
  clientId: number
  description: string | null
  address1: string | null
  address2: string | null
  city: string | null
  postalCode: string | null
  country: string | null
}

export class PropertyTransformer implements ITransformer<PropertyDTO, s.properties.Insertable, s.properties.JSONSelectable> {
  deserialize(dto: PropertyDTO): s.properties.Insertable {
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

  serialize(model: s.properties.JSONSelectable): PropertyDTO {
    return {
      ...model,
      clientId: model.client_id,
      postalCode: model.postal_code
    }
  }
}

type PropertyQueryParams = QueryParams<s.properties.Table> & {
  clientId?: number
}

export function fromQuery(query: PropertyQueryParams): s.properties.Whereable {
  const where: s.properties.Whereable = {}
  if (query.clientId) {
    where.client_id = query.clientId
  }
  return where
}

export class PropertyController extends BaseController<s.properties.Insertable, s.properties.JSONSelectable, s.properties.Whereable, s.properties.Table, PropertyDTO, PropertyQueryParams> {
  public static inject = ['propertyRepository', 'propertyTransformer', 'propertyQuery'] as const;
}

export default PropertyController