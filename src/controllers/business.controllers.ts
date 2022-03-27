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

export function fromQuery(query: QueryParams<s.businesses.Table>): s.businesses.Whereable {
  return {}
}

class BusinessController extends BaseController<s.businesses.Insertable, s.businesses.JSONSelectable, s.businesses.Whereable, s.businesses.Table, BusinessDTO, QueryParams<s.businesses.Table>> {
  public static inject = ['businessRepository', 'businessTransformer', 'businessQuery'] as const;

  async getBusiness(
    req: Request<{ businessId: string }, unknown, unknown, unknown>,
    res: Response<BusinessDTO | string>,
    next: NextFunction
  ): Promise<void> {
    if (req.user) {
      try {
        const business = await this.repository.get(
          req.user.sub,
          parseInt(req.params.businessId, 10)
        )

        if (business) {
          res.status(200).json(this.transformer.serialize(business))
        } else {
          res.status(404).send("Not found")
        }
      } catch (err) {
        next(err)
      }
    }
  }
}

export default BusinessController