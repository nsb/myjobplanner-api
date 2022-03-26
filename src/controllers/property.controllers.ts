import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema';
import { IPropertyRepository } from '../repositories/PropertyRepository'
import type { ApiEnvelope, QueryParams } from '../types'

interface PropertyDTO {
  id?: number
  clientId: number
  description: string | null
  address1: string | null
  address2: string | null
  city: string | null
  postalCode: string | null
  country: string | null
}

type PropertyQueryParams = QueryParams<s.properties.Table> & {
  clientId?: number
}

export class PropertyController {
  constructor(private repository: IPropertyRepository) { }
  public static inject = ['propertyRepository'] as const;

  async createProperty(
    req: Request<{}, {}, PropertyDTO>, res: Response<PropertyDTO>,
    next: NextFunction
  ): Promise<void> {
    if (req.user) {

      const property = {
        client_id: req.body.clientId,
        description: req.body.description,
        address1: req.body.address1,
        address2: req.body.address1,
        city: req.body.city,
        postal_code: req.body.postalCode,
        country: req.body.country
      }

      try {
        const result = await this.repository.create(req.user.sub, property)
        res.status(200).json({
          ...result,
          clientId: result.client_id,
          postalCode: result.postal_code
        })
      } catch (err) {
        next(err)
      }
    }
  }

  async getProperties(
    req: Request<unknown, unknown, unknown, PropertyQueryParams>,
    res: Response<ApiEnvelope<PropertyDTO>>,
    next: NextFunction
  ): Promise<void> {
    if (req.user) {
      try {
        const offset = parseInt(req.query.offset || "0", 10)
        const limit = parseInt(req.query.limit || "20", 10)
        const orderBy = 'created'
        const orderDirection = 'ASC'
        const where: s.properties.Whereable = {}
        if (req.query.clientId) {
          where.client_id = req.query.clientId
        }
        const { totalCount, result } = await this.repository.find(
          req.user.sub,
          where,
          { limit, offset, orderBy, orderDirection }
        )

        res.status(200).json({
          data: result.map(property => {
            return {
              ...property,
              clientId: property.client_id,
              postalCode: property.postal_code
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
}

export default PropertyController