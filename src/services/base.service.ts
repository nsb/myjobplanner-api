import { Pool } from 'pg'
import * as s from 'zapatos/schema'
import * as db from 'zapatos/db'
import { IRepository } from '../repositories/BaseRepository'
import { ListResponse, RepositoryOptions } from '../types'

export interface IService<Insertable, Updatable, Selectable, Whereable, Table extends s.Table> {
    create (userId: string, insertable: Insertable, businessId?: number): Promise<Selectable>
    update (userId: string, id: number, business: Updatable, businessId?: number): Promise<Selectable>
    find (userId: string, where: Whereable, options: RepositoryOptions<Table>, businessId?: number): Promise<ListResponse<Selectable>>
    get(userId: string, id: number, businessId?: number): Promise<Selectable | undefined>
}

export abstract class BaseService<
  Insertable,
  Updatable,
  Selectable,
  Whereable,
  Table extends s.Table
> implements IService<Insertable, Updatable, Selectable, Whereable, Table> {
  constructor (
        protected pool: Pool,
        protected repository: IRepository<Insertable, Updatable, Selectable, Whereable, Table>
  ) {}

  async create (userId: string, model: Insertable, businessId?: number) {
    return db.readCommitted(this.pool, async txnClient => {
      return this.repository.create(userId, model, businessId, txnClient)
    })
  }

  async update (userId: string, id: number, model: Updatable, businessId: number) {
    return db.readCommitted(this.pool, async txnClient => {
      return this.repository.update(
        userId,
        id,
        model,
        businessId,
        txnClient
      )
    })
  }

  async find (
    userId: string,
    where: Whereable,
    { limit, offset, orderBy, orderDirection }: RepositoryOptions<Table>,
    businessId?: number
  ) {
    return this.repository.find(
      userId,
      where,
      { limit, offset, orderBy, orderDirection },
      businessId)
  }

  async get (userId: string, id: number, businessId: number) {
    return this.repository.get(userId, id, businessId)
  }
}
