import * as s from 'zapatos/schema'
import type { QueryParams } from '../types'
import type { components } from '../schema'
import BaseController from './BaseController'
import { inject, injectable } from 'inversify'
import { IBusinessService } from '../services/business.service'

type DTO = components['schemas']['Business']

@injectable()
class BusinessController extends BaseController<
  s.businesses.Insertable,
  s.businesses.Updatable,
  s.businesses.JSONSelectable,
  s.businesses.Whereable,
  s.businesses.Table,
  DTO,
  QueryParams<DTO>
> {
  constructor (
    @inject('businessService') service: IBusinessService,
      offset: number = 0,
      limit: number = 20,
      orderDirection: 'ASC' | 'DESC' = 'ASC'
  ) {
    super(service, offset, limit, orderDirection)
  }

  deserializeInsert (dto: DTO) {
    return {
      name: dto.name,
      timezone: dto.timezone,
      country_code: dto.countryCode
    }
  }

  deserializeUpdate (_Id: number, dto: DTO) {
    return {
      name: dto.name,
      timezone: dto.timezone,
      country_code: dto.countryCode
    }
  }

  serialize (model: s.businesses.JSONSelectable) {
    return {
      ...model,
      id: `/businesses/${model.id}`,
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
