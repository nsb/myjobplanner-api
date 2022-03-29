import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema';
import type { ApiEnvelope, QueryParams, RepositoryOptions, ITransformer } from '../types'
import BaseController from './BaseController';

interface BusinessDTO {
  id?: number
  name: string
  timezone: string
  countryCode: string
}

export class BusinessTransformer implements ITransformer<BusinessDTO, s.businesses.Insertable, s.businesses.JSONSelectable> {
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
}

type BusinessQueryParams = QueryParams<BusinessDTO>

export function fromQuery(query: BusinessQueryParams): s.businesses.Whereable {
  return {}
}

class BusinessController extends BaseController<s.businesses.Insertable, s.businesses.JSONSelectable, s.businesses.Whereable, s.businesses.Table, BusinessDTO, BusinessQueryParams> {
  public static inject = ['businessRepository', 'businessTransformer', 'businessQuery'] as const;

  getOrderBy(key: keyof BusinessDTO): s.SQLForTable<s.businesses.Table> {
    switch (key) {
      case 'countryCode':
        return 'country_code'
      default:
        return key
    }
  }
}

export default BusinessController