import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema'
import { IRepository } from '../repositories/BaseRepository'
import type { ApiEnvelope, QueryParams } from '../types'

export abstract class BaseController<
  Insertable,
  Selectable,
  Whereable,
  Table extends s.Table,
  DTO,
  Params extends QueryParams<DTO>
> {
  constructor (
    public repository: IRepository<Insertable, s.Updatable, Selectable, Whereable, Table>,
    public offset: number = 0,
    public limit: number = 20,
    public orderDirection: 'ASC' | 'DESC' = 'ASC'
  ) { }

  abstract deserialize(dto: DTO): Insertable
  abstract serialize(model: Selectable): DTO
  abstract getOrderBy(key: keyof DTO): s.SQLForTable<Table>
  abstract fromQuery(params: Params): Whereable

  async create (
    req: Request<{}, {}, DTO>,
    res: Response<DTO>,
    next: NextFunction
  ) {
    if (req.user) {
      const deserialized = this.deserialize(req.body)
      try {
        const result = await this.repository.create(
          req.user.sub,
          deserialized
        )
        await this.afterCreate(result)
        res.status(200).json(this.serialize(result))
      } catch (err) {
        next(err)
      }
    }
  }

  protected async afterCreate (result: Selectable) { }

  async update (
    req: Request<{ Id: string }, {}, DTO>,
    res: Response<DTO>,
    next: NextFunction
  ) {
    if (req.user) {
      const deserialized = this.deserialize(req.body)
      try {
        const result = await this.repository.update(
          req.user.sub,
          parseInt(req.params.Id, 10),
          deserialized
        )
        await this.afterUpdate(result)
        res.status(200).json(this.serialize(result))
      } catch (err) {
        next(err)
      }
    }
  }

  protected async afterUpdate (result: Selectable) { }

  async getList (
    req: Request<{businessId?: string}, unknown, unknown, Params>,
    res: Response<ApiEnvelope<DTO>>,
    next: NextFunction
  ) {
    if (req.user) {
      try {
        const offset = parseInt(req.query.offset || 'NaN', 10) || this.offset
        const limit = parseInt(req.query.limit || 'Nan', 10) || this.limit
        const orderBy = req.query.orderBy ? this.getOrderBy(req.query.orderBy) : undefined
        const orderDirection = req.query.orderDirection || this.orderDirection
        const businessId = parseInt(req.params.businessId || 'NaN', 10)
        const where = this.fromQuery(req.query)
        const { totalCount, result } = await this.repository.find(
          req.user.sub,
          where,
          { limit, offset, orderBy, orderDirection, businessId }
        )

        res.status(200).json({
          data: result.map(this.serialize),
          meta: {
            totalCount
          }
        })
      } catch (err) {
        next(err)
      }
    }
  }

  async getOne (
    req: Request<{ Id: string }, unknown, unknown, unknown>,
    res: Response<DTO | string>,
    next: NextFunction
  ) {
    if (req.user) {
      try {
        const result = await this.repository.get(
          req.user.sub,
          parseInt(req.params.Id, 10)
        )

        if (result) {
          res.status(200).json(this.serialize(result))
        } else {
          res.status(404).send('Not found')
        }
      } catch (err) {
        next(err)
      }
    }
  }
}

export default BaseController
