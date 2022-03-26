import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema';
import { IClientRepository } from '../repositories/ClientRepository'
import type { ApiEnvelope, QueryParams } from '../types'

interface ClientDTO {
  id?: number
  businessId: number
  firstName: string | null
  lastName: string | null
}

type defaultQueryParams = QueryParams<s.businesses.Table> & {
  businessId?: number
}

export class ClientController {
  constructor(private repository: IClientRepository) { }
  public static inject = ['clientRepository'] as const;

  async createClient(req: Request<{}, {}, ClientDTO>, res: Response<ClientDTO>, next: NextFunction): Promise<void> {
    if (req.user) {

      const client = {
        business_id: req.body.businessId,
        first_name: req.body.firstName,
        last_name: req.body.lastName
      }

      try {
        const result = await this.repository.create(req.user.sub, client)
        res.status(200).json({
          ...result,
          businessId: result.business_id,
          firstName: result.first_name,
          lastName: result.last_name
        })
      } catch (err) {
        next(err)
      }
    }
  }

  async getClients(req: Request<unknown, unknown, unknown, defaultQueryParams>, res: Response<ApiEnvelope<ClientDTO>>, next: NextFunction): Promise<void> {
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
          data: result.map(client => {
            return {
              ...client,
              businessId: client.business_id,
              firstName: client.first_name,
              lastName: client.last_name
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

export default ClientController