import { Request, Response } from 'express'
import type * as s from 'zapatos/schema';
import BusinessRepository from '../repositories/BusinessRepository';

export class BusinessController {
  constructor(private repository: BusinessRepository) { }
  public static inject = ['businessRepository'] as const;

  async createBusinesses(req: Request, res: Response): Promise<void> {
    if (req.user) {

      const business: s.businesses.Insertable = {
        ...req.body,
        country_code: req.body.countryCode
      }

      const result = await this.repository.create(req.user.sub, business)
      res.status(200).json({
        ...business,
        countryCode: business.country_code
      })
    }
  }

  async getBusinesses(req: Request, res: Response): Promise<void> {
    if (req.user) {
      const businesses = await this.repository.find(req.user.sub, req.params)

      res.status(200).json(businesses.map(business => {
        return {
          ...business,
          countryCode: business.country_code
        }
      }))
    }
  }
}

export default BusinessController