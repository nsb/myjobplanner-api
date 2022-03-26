import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema';
import { IPropertyRepository } from '../repositories/PropertyRepository'
import type { ApiEnvelope, QueryParams, ITransformer } from '../types'
import BaseController from './BaseController';

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

export class PropertyTransformer implements ITransformer<PropertyDTO, s.properties.Insertable, s.properties.JSONSelectable> {
  deserialize(dto: PropertyDTO): s.properties.Insertable {
    return {
      client_id: dto.clientId,
      description: dto.description,
      address1: dto.address1,
      address2: dto.address1,
      city: dto.city,
      postal_code: dto.postalCode,
      country: dto.country
    }
  }

  serialize(model: s.properties.JSONSelectable): PropertyDTO {
    return {
      ...model,
      clientId: model.client_id,
      postalCode: model.postal_code
    }
  }
}

type PropertyQueryParams = QueryParams<s.properties.Table> & {
  clientId?: number
}

export class PropertyController extends BaseController<s.properties.Insertable, s.properties.JSONSelectable, s.properties.Whereable, s.properties.Table, PropertyDTO> {
  public static inject = ['propertyRepository', 'propertyTransformer'] as const;

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