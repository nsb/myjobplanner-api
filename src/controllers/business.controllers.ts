import { Request, Response, NextFunction } from 'express'
import type * as s from 'zapatos/schema';
import { IBusinessRepository } from '../repositories/BusinessRepository';

interface BusinessDTO {
  id?: number,
  name: string,
  timezone: string,
  countryCode: string
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

  async getBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.user) {
      try {
        const businesses = await this.repository.find(req.user.sub, req.params)

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