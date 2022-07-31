import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import { injectable, inject } from 'inversify'
import type { ListResponse, RepositoryOptions } from '../types'
import type { IRepository } from './BaseRepository'

export interface IBusinessRepository extends IRepository<
  s.businesses.Insertable,
  s.businesses.Updatable,
  s.businesses.JSONSelectable,
  s.businesses.Whereable,
  s.businesses.Table
> { }

@injectable()
class BusinessRepository implements IBusinessRepository {
  constructor (@inject('pool') private pool: Pool) { }

  async create (
    _userId: string,
    business: s.businesses.Insertable,
    _businessId?: number,
    txnClient?: db.TxnClientForReadCommitted
  ) {
    return db.insert('businesses', business).run(txnClient || this.pool)
  }

  async update (
    _userId: string,
    id: number,
    business: s.businesses.Updatable,
    _businessId?: number,
    txnClient?: db.TxnClientForReadCommitted
  ) {
    const updatedBusiness = await db.update('businesses', business, { id }).run(txnClient || this.pool)
    return updatedBusiness[0]
  }

  async find (
    userId: string,
    business: s.businesses.Whereable,
    options?: RepositoryOptions<s.businesses.Table>
  ) {
    const businessesSql = db.select('employees', { user_id: userId }, {
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      order: {
        by: db.sql`result->'${options?.orderBy || 'created'}'`,
        direction: options?.orderDirection || 'DESC'
      },
      lateral: db.selectExactlyOne('businesses', { ...business, id: db.parent('business_id') }
      )
    })
    const businessesPromise = businessesSql.run(this.pool)

    const countSql = db.sql<s.businesses.SQL | s.employees.SQL, Array<{ result: number }>>`
      SELECT COUNT(*)::int AS result
      FROM ${'businesses'} JOIN ${'employees'}
      ON ${'businesses'}.${'id'} = ${'employees'}.${'business_id'}
      WHERE ${{ ...business, user_id: userId }}`
    const countPromise = countSql.run(this.pool)

    const [totalCount, businesses] = await Promise.all([countPromise, businessesPromise])

    return [
      totalCount[0].result,
      businesses.filter(business => business != null)
    ] as ListResponse<s.businesses.JSONSelectable>
  }

  async get (userId: string, id: number) {
    return db.selectOne('employees', { user_id: userId, business_id: id }, {
      lateral: db.selectExactlyOne('businesses', { id: db.parent('business_id') })
    }).run(this.pool)
  }
}

export default BusinessRepository
