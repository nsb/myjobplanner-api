import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import logger from '../logger'
import type { RepositoryOptions, ListResponse } from '../types'
import { IRepository } from './BaseRepository'

export interface IBusinessRepository extends IRepository<
  s.businesses.Insertable,
  s.businesses.Updatable,
  s.businesses.JSONSelectable,
  s.businesses.Whereable,
  s.businesses.Table
> { }

class BusinessRepository implements IBusinessRepository {
  constructor (private pool: Pool) { }
  public static inject = ['pool'] as const

  async create (userId: string, business: s.businesses.Insertable): Promise<s.businesses.JSONSelectable> {
    return db.readCommitted(this.pool, async txnClient => {
      const createdBusiness = await db.insert('businesses', business).run(txnClient)

      const employee: s.employees.Insertable = {
        user_id: userId,
        business_id: createdBusiness.id,
        role: 'admin'
      }

      await db.sql<s.employees.SQL, s.employees.Selectable>`
          INSERT INTO ${'employees'} (${db.cols(employee)})
          VALUES (${db.vals(employee)})`.run(txnClient)

      return createdBusiness
    })
  }

  async update (userId: string, id: number, business: s.businesses.Updatable): Promise<s.businesses.JSONSelectable> {
    return db.readCommitted(this.pool, async txnClient => {
      const updatedBusiness = await db.update('businesses', business, { id }).run(txnClient)
      return updatedBusiness[0]
    })
  }

  async find (
    userId: string,
    business?: s.businesses.Whereable,
    options?: RepositoryOptions<s.businesses.Table>
  ): Promise<ListResponse<s.businesses.JSONSelectable>> {
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
    logger.debug(businessesSql.compile())
    const businessesPromise = businessesSql.run(this.pool)

    const countSql = db.sql<s.businesses.SQL | s.employees.SQL, Array<{ result: number }>>`
      SELECT COUNT(*)::int AS result
      FROM ${'businesses'} JOIN ${'employees'}
      ON ${'businesses'}.${'id'} = ${'employees'}.${'business_id'}
      WHERE ${{ ...business, user_id: userId }}`
    logger.debug(countSql.compile())
    const countPromise = countSql.run(this.pool)

    const [totalCount, businesses] = await Promise.all([countPromise, businessesPromise])

    return { totalCount: totalCount[0].result, result: businesses?.filter(business => business != null) }
  }

  async get (userId: string, id: number): Promise<s.businesses.JSONSelectable | undefined> {
    return await db.selectOne('employees', { user_id: userId, business_id: id }, {
      lateral: db.selectExactlyOne('businesses', { id: db.parent('business_id') })
    }).run(this.pool)
  }
}

export default BusinessRepository
