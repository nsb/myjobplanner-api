import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema'
import { IClientRepository } from '../repositories/ClientRepository'
import BaseController from './BaseController'
import type { ApiEnvelope, QueryParams, ITransformer } from '../types'

interface ClientDTO {
  id?: number
  businessId: number
  firstName: string | null
  lastName: string | null
}

export class ClientTransformer implements ITransformer<ClientDTO, s.clients.Insertable, s.clients.JSONSelectable> {
  deserialize(dto: ClientDTO): s.clients.Insertable {
    return {
      business_id: dto.businessId,
      first_name: dto.firstName,
      last_name: dto.lastName
    }
  }

  serialize(model: s.clients.JSONSelectable): ClientDTO {
    return {
      ...model,
      businessId: model.business_id,
      firstName: model.first_name,
      lastName: model.last_name
    }
  }
}

type ClientQueryParams = QueryParams<s.clients.Table> & {
  businessId?: number
}

export class ClientController extends BaseController<s.clients.Insertable, s.clients.JSONSelectable, s.clients.Whereable, s.clients.Table, ClientDTO> {
  public static inject = ['clientRepository', 'clientTransformer'] as const;

  async getClients(
    req: Request<unknown, unknown, unknown, ClientQueryParams>,
    res: Response<ApiEnvelope<ClientDTO>>,
    next: NextFunction
  ): Promise<void> {
    if (req.user) {
      try {
        const offset = parseInt(req.query.offset || "0", 10)
        const limit = parseInt(req.query.limit || "20", 10)
        const orderBy = 'created'
        const orderDirection = 'ASC'
        const where: s.clients.Whereable = {}
        if (req.query.businessId) {
          where.business_id = req.query.businessId
        }
        const { totalCount, result } = await this.repository.find(req.user.sub, where, { limit, offset, orderBy, orderDirection })

        res.status(200).json({
          data: result.map(this.transformer.serialize),
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

export default ClientController