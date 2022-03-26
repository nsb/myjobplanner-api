import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema';
import { IRepository } from '../repositories/BaseRepository'
import type { ApiEnvelope, QueryParams, ITransformer } from '../types'

export abstract class BaseController<Insertable, Selectable, Whereable, Table extends s.Table, DTO> {
  constructor(
    public repository: IRepository<Insertable, Selectable, Whereable, Table>,
    public transformer: ITransformer<DTO, Insertable, Selectable>
  ) { }

  async create(req: Request<{}, {}, DTO>, res: Response<DTO>, next: NextFunction): Promise<void> {
    if (req.user) {
      try {
        const result = await this.repository.create(
          req.user.sub,
          this.transformer.deserialize(req.body)
        )
        res.status(200).json(this.transformer.serialize(result))
      } catch (err) {
        next(err)
      }
    }
  }

  //   async getClients(req: Request<unknown, unknown, unknown, ClientQueryParams>, res: Response<ApiEnvelope<ClientDTO>>, next: NextFunction): Promise<void> {
  //     if (req.user) {
  //       try {
  //         const offset = parseInt(req.query.offset || "0", 10)
  //         const limit = parseInt(req.query.limit || "20", 10)
  //         const orderBy = 'created'
  //         const orderDirection = 'ASC'
  //         const where: s.clients.Whereable = {}
  //         if (req.query.businessId) {
  //           where.business_id = req.query.businessId
  //         }
  //         const { totalCount, result } = await this.repository.find(req.user.sub, where, { limit, offset, orderBy, orderDirection })

  //         res.status(200).json({
  //           data: result.map(this.transformer.serialize),
  //           meta: {
  //             totalCount
  //           }
  //         })
  //       } catch (err) {
  //         next(err)
  //       }
  //     }
  //   }
}

export default BaseController