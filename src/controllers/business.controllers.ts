import { Request, Response, NextFunction } from 'express'
import type * as s from 'zapatos/schema';
import { IBusinessRepository } from '../repositories/BusinessRepository';

interface BusinessDTO {
  id?: number,
  name: string,
  timezone: string,
  countryCode: string
}

type defaultQueryParams = {
  limit: string | undefined,
  offset: string | undefined,
  orderBy: string | undefined,
  orderDirection: string | undefined
}

export class BusinessController {
  constructor(private repository: IBusinessRepository) { }
  public static inject = ['businessRepository'] as const;

  async createBusinesses(req: Request<{}, {}, BusinessDTO>, res: Response<BusinessDTO>, next: NextFunction): Promise<void> {
    if (req.user) {

      const business = {
        name: req.body.name,
        timezone: req.body.timezone,
        country_code: req.body.countryCode
      }

      try {
        const result = await this.repository.create(req.user.sub, business)
        res.status(200).json({
          ...result,
          countryCode: result.country_code
        })
      } catch (err) {
        next(err)
      }
    }
  }

  async getBusinesses(req: Request<unknown, unknown, unknown, defaultQueryParams>, res: Response, next: NextFunction): Promise<void> {
    if (req.user) {
      try {
        const offset = parseInt(req.query.offset || "0", 10)
        const limit = parseInt(req.query.limit || "20", 10)
        const orderBy = 'created'
        const orderDirection = 'ASC'
        const businesses = await this.repository.find(req.user.sub, {}, { limit, offset, orderBy, orderDirection })

        res.status(200).json(businesses.map(business => {
          return {
            ...business,
            countryCode: business.country_code
          }
        }))
      } catch (err) {
        next(err)
      }
    }
  }
}

export default BusinessController