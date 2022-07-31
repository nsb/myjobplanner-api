import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IRepository } from './BaseRepository'
import type { RepositoryOptions, ListResponse } from '../types'
import { inject, injectable } from 'inversify'

// eslint-disable-next-line camelcase
export interface ILineItemOverrideRepository extends IRepository<
  s.lineitem_overrides.Insertable,
  s.lineitem_overrides.Updatable,
  s.lineitem_overrides.JSONSelectable,
  s.lineitem_overrides.Whereable,
  s.lineitem_overrides.Table
> {
  delete(userId: string, where: s.lineitem_overrides.Whereable, businessId?: number): Promise<s.lineitem_overrides.JSONSelectable[]>
}

@injectable()
class LineItemOverrideRepository implements ILineItemOverrideRepository {
  constructor (@inject('pool') private pool: Pool) { }

  async create (
    _userId: string,
    // eslint-disable-next-line camelcase
    lineItem: s.lineitem_overrides.Insertable,
    _businessId: number,
    txnClient?: db.TxnClientForReadCommitted
  ) {
    return db.insert('lineitem_overrides', lineItem).run(txnClient || this.pool)
  }

  async update (
    _userId: string,
    id: number,
    // eslint-disable-next-line camelcase
    lineItem: s.lineitem_overrides.Updatable,
    _businessId: number,
    txnClient?: db.TxnClientForReadCommitted
  ) {
    const updatedLineItem = await db.update(
      'lineitem_overrides',
      lineItem,
      { id }
    ).run(txnClient || this.pool)
    return updatedLineItem[0]
  }

  async find (
    _userId: string,
    // eslint-disable-next-line camelcase
    lineItem?: s.lineitem_overrides.Whereable,
    // eslint-disable-next-line camelcase
    options?: RepositoryOptions<s.lineitem_overrides.Table>,
    _businessId?: number
    // eslint-disable-next-line camelcase
  ): Promise<ListResponse<s.lineitem_overrides.JSONSelectable>> {
    // eslint-disable-next-line camelcase
    const lineItemsSql = db.select('lineitem_overrides', lineItem || {}, options)
    const lineItemsPromise = lineItemsSql.run(this.pool)

    const countSql = db.count('lineitem_overrides', lineItem || {})
    const countPromise = countSql.run(this.pool)

    const [totalCount, overrides] = await Promise.all([countPromise, lineItemsPromise])
    return [totalCount, overrides]
  }

  async get (_userId: string, id: number, _businessId: number) {
    return db.selectOne('lineitem_overrides', { lineitem_id: id }).run(this.pool)
  }

  async delete (
    _userId: string,
    override: s.lineitem_overrides.Whereable,
    _businessId?: number,
    txnClient?: db.TxnClientForReadCommitted) {
    return db.deletes('lineitem_overrides', override).run(txnClient || this.pool)
  }
}

export default LineItemOverrideRepository
