import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema'
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
    private service: IService<Insertable, Updatable, Selectable, Whereable, Table>,
    public offset: number = 0,
    public limit: number = 20,
    public orderDirection: 'ASC' | 'DESC' = 'ASC'
  ) { }

  abstract deserializeInsert(dto: DTO, businessId?: number): Insertable
  abstract deserializeUpdate(dto: DTO, businessId?: number): Updatable
  abstract serialize(model: Selectable, businessId?: number): DTO
  abstract getOrderBy(key: keyof DTO): s.SQLForTable<Table>
  abstract fromQuery(params: Params): Whereable

  async create (
    req: Request<{businessId?: string}, {}, DTO>,
    res: Response<DTO>,
    next: NextFunction
  ) {
    if (req.user) {
      const businessId = req.params.businessId ? parseInt(req.params.businessId) : undefined
      const deserialized = this.deserializeInsert(req.body, businessId)
      try {
        if (!this.validate(req.user.sub, deserialized, businessId)) {
          throw new Error('Bad request')
        }
        const result = await this.service.create(
          req.user.sub,
          deserialized,
          businessId
        )
        await this.afterCreate(req, result)
        res.status(201).json(this.serialize(result, businessId))
      } catch (err) {
        next(err)
      }
    }
  }

  protected async afterCreate (_req: Request, _result: Selectable) { }

  protected validate (
    _userId: string,
    _deserialized: Insertable | Updatable,
    _businessId?: number
  ) {
    return true
  }

  protected getIdsFromURI (uri: string) {
    const match = uri.match(/\d+/g)
    if (match) {
      return match.map((Id) => parseInt(Id, 10))
    } else {
      return []
    }
  }

  async update (
    req: Request<{ Id: string, businessId?: string }, {}, DTO>,
    res: Response<DTO>,
    next: NextFunction
  ) {
    if (req.user) {
      const businessId = req.params.businessId ? parseInt(req.params.businessId) : undefined
      const deserialized = this.deserializeUpdate(req.body)
      try {
        if (!this.validate(req.user.sub, deserialized, businessId)) {
          throw new Error('Bad request')
        }
        const result = await this.service.update(
          req.user.sub,
          parseInt(req.params.Id, 10),
          deserialized,
          businessId
        )
        await this.afterUpdate(result)
        res.status(200).json(this.serialize(result, businessId))
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
      const businessId = req.params.businessId ? parseInt(req.params.businessId) : undefined
      try {
        const offset = parseInt(req.query.offset || 'NaN', 10) || this.offset
        const limit = parseInt(req.query.limit || 'Nan', 10) || this.limit
        const orderBy = req.query.orderBy ? this.getOrderBy(req.query.orderBy) : undefined
        const orderDirection = req.query.orderDirection || this.orderDirection
        const where = this.fromQuery(req.query)
        const [totalCount, result] = await this.service.find(
          req.user.sub,
          where,
          { limit, offset, orderBy, orderDirection },
          req.params.businessId ? parseInt(req.params.businessId) : undefined
        )

        res.status(200).json({
          data: result.map(r => this.serialize(r, businessId)),
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
      const businessId = req.params.businessId ? parseInt(req.params.businessId) : undefined
      try {
        const result = await this.service.get(
          req.user.sub,
          parseInt(req.params.Id, 10),
          req.params.businessId ? parseInt(req.params.businessId) : undefined
        )

        if (result) {
          res.status(200).json(this.serialize(result, businessId))
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
