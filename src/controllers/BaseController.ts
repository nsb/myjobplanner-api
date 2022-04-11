import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema'
import type { IRepository } from '../repositories/BaseRepository'
import type { IService } from '../services/base.service'
import type { ApiEnvelope, QueryParams } from '../types'

export abstract class BaseController<
  Insertable,
  Updatable,
  Selectable,
  Whereable,
  Table extends s.Table,
  DTO,
  Params extends QueryParams<DTO>
> {
  constructor (
    public repository: IRepository<Insertable, Updatable, Selectable, Whereable, Table>,
    private service: IService<Insertable, Updatable, Selectable>,
    public offset: number = 0,
    public limit: number = 20,
    public orderDirection: 'ASC' | 'DESC' = 'ASC'
  ) { }

  abstract deserializeInsert(dto: DTO): Insertable
  abstract deserializeUpdate(dto: DTO): Updatable
  abstract serialize(model: Selectable): DTO
  abstract getOrderBy(key: keyof DTO): s.SQLForTable<Table>
  abstract fromQuery(params: Params): Whereable

  async create (
    req: Request<{businessId?: string}, {}, DTO>,
    res: Response<DTO>,
    next: NextFunction
  ) {
    if (req.user) {
      const deserialized = this.deserializeInsert(req.body)
      try {
        const result = await this.service.create(
          req.user.sub,
          deserialized,
          req.params.businessId ? parseInt(req.params.businessId) : undefined
        )
        await this.afterCreate(req, result)
        res.status(200).json(this.serialize(result))
      } catch (err) {
        next(err)
      }
    }
  }

  protected async afterCreate (req: Request, result: Selectable) { }

  async update (
    req: Request<{ Id: string, businessId?: string }, {}, DTO>,
    res: Response<DTO>,
    next: NextFunction
  ) {
    if (req.user) {
      const deserialized = this.deserializeUpdate(req.body)
      try {
        const result = await this.service.update(
          req.user.sub,
          parseInt(req.params.Id, 10),
          deserialized,
          req.params.businessId ? parseInt(req.params.businessId) : undefined
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
        const where = this.fromQuery(req.query)
        const { totalCount, result } = await this.repository.find(
          req.user.sub,
          where,
          { limit, offset, orderBy, orderDirection },
          req.params.businessId ? parseInt(req.params.businessId) : undefined
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
    req: Request<{ Id: string, businessId?: string }, unknown, unknown, unknown>,
    res: Response<DTO | string>,
    next: NextFunction
  ) {
    if (req.user) {
      try {
        const result = await this.repository.get(
          req.user.sub,
          parseInt(req.params.Id, 10),
          req.params.businessId ? parseInt(req.params.businessId) : undefined
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
