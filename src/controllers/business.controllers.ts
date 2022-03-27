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

class BusinessController extends BaseController<s.businesses.Insertable, s.businesses.JSONSelectable, s.businesses.Whereable, s.businesses.Table, BusinessDTO> {
  public static inject = ['businessRepository', 'businessTransformer'] as const;

  async getBusinesses(
    req: Request<unknown, unknown, unknown, QueryParams<s.businesses.Table>>,
    res: Response<ApiEnvelope<BusinessDTO>>,
    next: NextFunction
  ): Promise<void> {
    if (req.user) {
      try {
        const options: RepositoryOptions<s.businesses.Table> = {
          limit: parseInt(req.query.limit || "20", 10),
          offset: parseInt(req.query.offset || "0", 10),
          orderBy: req.query.orderBy,
          orderDirection: req.query.orderDirection || 'ASC'
        }
        const { totalCount, result } = await this.repository.find(req.user.sub, {}, options)

        res.status(200).json({
          data: result.map(business => {
            return {
              ...business,
              countryCode: business.country_code
            }
          }),
          meta: {
            totalCount
          }
        })
      } catch (err) {
        next(err)
      }
    }
  }

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