import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IRepository } from './BaseRepository'
import type { RepositoryOptions, ListResponse } from '../types'

export type IVisitRepository = IRepository<
  s.visits.Insertable,
  s.visits.Updatable,
  s.visits.JSONSelectable,
  [s.visits.Whereable, s.clients.Whereable],
  s.visits.Table
>

class VisitRepository implements IVisitRepository {
  constructor (private pool: Pool) { }
  public static inject = ['pool'] as const

  async create (
    _userId: string,
    visit: s.visits.Insertable,
    _businessId: number
  ): Promise<s.visits.JSONSelectable> {
    return db.readCommitted(this.pool, async txnClient => {
      const createdVisitSql = db.insert('visits', visit)
      return await createdVisitSql.run(txnClient)
    })
  }

  async update (
    _userId: string,
    id: number,
    visit: s.visits.Updatable,
    _businessId: number
  ): Promise<s.visits.JSONSelectable> {
    return db.readCommitted(this.pool, async txnClient => {
      const updatedBusiness = await db.update('visits', visit, { id }).run(txnClient)
      return updatedBusiness[0]
    })
  }

  async find (
    _userId: string,
    [visit, client]: [s.visits.Whereable, s.clients.Whereable],
    options?: RepositoryOptions<s.visits.Table>,
    businessId?: number
  ): Promise<ListResponse<s.visits.JSONSelectable>> {
    const visitsSql = db.sql<s.visits.SQL | s.jobs.SQL | s.clients.SQL, Array<{ result: Array<s.visits.JSONSelectable>}>>`
    SELECT coalesce(json_agg(result), '[]') AS result FROM (
      SELECT v.* FROM
        (SELECT * FROM ${'clients'}
         WHERE ${{ ...client }}) c
        JOIN ${'jobs'} j
        ON j.${'client_id'} = c.${'id'}
      JOIN 
        (SELECT * FROM visits v
         WHERE ${{ ...visit }}) v
      ON v.${'job_id'} = j.${'id'}
      WHERE c.${'business_id'} = ${db.param(businessId)}
    ORDER BY ${db.param(options?.orderBy || 'created')} ${db.raw(options?.orderDirection || 'DESC')}
    LIMIT ${db.param(options?.limit || 20)}
    OFFSET ${db.param(options?.offset || 0)}
    ) result`

    const visitsPromise = visitsSql.run(this.pool)

    const countSql = db.sql<s.visits.SQL | s.jobs.SQL | s.clients.SQL, Array<{ result: number }>>`
      SELECT COUNT(*)::int AS result
      FROM
      (SELECT * FROM ${'clients'}
       WHERE ${{ ...client }}) c
      JOIN
      ${'jobs'} j
      ON j.${'client_id'} = c.${'id'}
      JOIN
        (SELECT *
        FROM ${'visits'}
        WHERE ${{ ...visit }}) v
      ON v.${'job_id'} = j.${'id'}
      WHERE c.${'business_id'} = ${db.param(businessId)}`
    const countPromise = countSql.run(this.pool)

    const [totalCount, visits] = await Promise.all([countPromise, visitsPromise])

    return [totalCount[0].result, visits[0].result]
  }

  async get (_userId: string, id: number, businessId: number): Promise<s.visits.JSONSelectable | undefined> {
    return db.selectOne('visits', { id }).run(this.pool)
  }
}

export default VisitRepository
