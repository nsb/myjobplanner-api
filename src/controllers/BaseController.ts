import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema';
import { IRepository } from '../repositories/BaseRepository'
import type { ITransformer, ApiEnvelope, QueryParams, IGetOrderBy } from '../types'

export abstract class BaseController<Insertable, Selectable, Whereable, Table extends s.Table, DTO, Params extends QueryParams<DTO>> {
  constructor(
    public repository: IRepository<Insertable, Selectable, Whereable, Table>,
    public transformer: ITransformer<DTO, Insertable, Selectable>,
    private fromQuery: (params: Params) => Whereable,
    private getOrderBy: IGetOrderBy<DTO, Table>
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

  async getList(
    req: Request<unknown, unknown, unknown, Params>,
    res: Response<ApiEnvelope<DTO>>,
    next: NextFunction
  ): Promise<void> {
    if (req.user) {
      try {
        const offset = parseInt(req.query.offset || "0", 10)
        const limit = parseInt(req.query.limit || "20", 10)
        const orderBy = req.query.orderBy ? this.getOrderBy(req.query.orderBy) : undefined
        const orderDirection = req.query.orderDirection || 'ASC'
        const where = this.fromQuery(req.query)
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

  async getOne(
    req: Request<{ ID: string }, unknown, unknown, unknown>,
    res: Response<DTO | string>,
    next: NextFunction
  ): Promise<void> {
    if (req.user) {
      try {
        const result = await this.repository.get(
          req.user.sub,
          parseInt(req.params.ID, 10)
        )

        if (result) {
          res.status(200).json(this.transformer.serialize(result))
        } else {
          res.status(404).send("Not found")
        }
      } catch (err) {
        next(err)
      }
    }
  }
}

export default BaseController