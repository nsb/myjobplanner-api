import * as s from 'zapatos/schema'
import type { QueryParams } from '../types'
import BaseController from './BaseController'

interface DTO {
  id?: number
  name: string
  timezone: string
  countryCode: string
}

class BusinessController extends BaseController<s.businesses.Insertable, s.businesses.JSONSelectable, s.businesses.Whereable, s.businesses.Table, DTO, QueryParams<DTO>> {
  public static inject = ['businessRepository'] as const;

  deserialize (dto: DTO) {
    return {
      name: dto.name,
      timezone: dto.timezone,
      country_code: dto.countryCode
    }
  }

  serialize (model: s.businesses.JSONSelectable) {
    return {
      ...model,
      countryCode: model.country_code
    }
  }

  getOrderBy (key: keyof DTO) {
    switch (key) {
      case 'countryCode':
        return 'country_code'
      default:
        return key
    }
  }

  fromQuery (query: QueryParams<DTO>) {
    return {}
  }
}

export default BusinessController
