import { Request, Response, NextFunction } from 'express'
import { IBusinessRepository } from '../repositories/BusinessRepository';

interface BusinessDTO {
  id?: number
  name: string
  timezone: string
  countryCode: string
}

type defaultQueryParams = {
  limit: string | undefined
  offset: string | undefined
  orderBy: 'id' | 'created' | 'name' | undefined
  orderDirection: 'ASC' | 'DESC' | undefined
}

type ApiEnvelope<T> = {
  data: T[]
  meta: {
    totalCount: number
  }
}

export class BusinessController {
  constructor(private repository: IBusinessRepository) { }
  public static inject = ['businessRepository'] as const;

  async createBusinesses(
    req: Request<{}, {}, BusinessDTO>,
    res: Response<BusinessDTO>,
    next: NextFunction
  ): Promise<void> {
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

  async getBusinesses(
    req: Request<unknown, unknown, unknown, defaultQueryParams>,
    res: Response<ApiEnvelope<BusinessDTO>>,
    next: NextFunction
  ): Promise<void> {
    if (req.user) {
      try {
        const options = {
          limit: parseInt(req.query.limit || "20", 10),
          offset: parseInt(req.query.offset || "0", 10),
          orderBy: req.query.orderBy || 'created',
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
    res: Response<BusinessDTO>,
    next: NextFunction
  ): Promise<void> {
    if (req.user) {
      try {
        const business = await this.repository.get(
          req.user.sub,
          parseInt(req.params.businessId, 10)
        )

        if (business) {
          res.status(200).json({
            ...business,
            countryCode: business.country_code
          })

        } else {
          res.status(404).json()
        }
      } catch (err) {
        next(err)
      }
    }
  }
}

export default BusinessController