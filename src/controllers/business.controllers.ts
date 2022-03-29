import * as s from 'zapatos/schema';
import type { QueryParams } from '../types'
import BaseController from './BaseController';

interface BusinessDTO {
  id?: number
  name: string
  timezone: string
  countryCode: string
}

type BusinessQueryParams = QueryParams<BusinessDTO>

class BusinessController extends BaseController<s.businesses.Insertable, s.businesses.JSONSelectable, s.businesses.Whereable, s.businesses.Table, BusinessDTO, BusinessQueryParams> {
  public static inject = ['businessRepository'] as const;

  deserialize(dto: BusinessDTO): s.businesses.Insertable {
    return {
      name: dto.name,
      timezone: dto.timezone,
      country_code: dto.countryCode
    }
  }

  serialize(model: s.businesses.JSONSelectable): BusinessDTO {
    return {
      ...model,
      countryCode: model.country_code
    }
  }

  getOrderBy(key: keyof BusinessDTO): s.SQLForTable<s.businesses.Table> {
    switch (key) {
      case 'countryCode':
        return 'country_code'
      default:
        return key
    }
  }

  fromQuery(query: BusinessQueryParams): s.businesses.Whereable {
    return {}
  }

}

export default BusinessController