import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IRepository } from './BaseRepository'
import type { RepositoryOptions, ListResponse } from '../types'

export type ILineItemRepository = IRepository<s.lineitems.Insertable, s.lineitems.Updatable, s.lineitems.JSONSelectable, s.lineitems.Whereable, s.lineitems.Table>

class LineItemRepository implements ILineItemRepository {
  constructor (private pool: Pool) { }
  public static inject = ['pool'] as const

  async create (
    _userId: string,
    lineItem: s.lineitems.Insertable,
    _businessId: number,
    txnClient?: db.TxnClientForReadCommitted
  ) {
    return db.insert('lineitems', lineItem).run(txnClient || this.pool)
  }

  async update (
    _userId: string,
    id: number,
    lineItem: s.lineitems.Updatable,
    _businessId: number,
    txnClient?: db.TxnClientForReadCommitted
  ) {
    const updatedLineItem = await db.update(
      'lineitems',
      lineItem,
      { id }
    ).run(txnClient || this.pool)
    return updatedLineItem[0]
  }

  async find (
    _userId: string,
    lineItem?: s.lineitems.Whereable,
    options?: RepositoryOptions<s.lineitems.Table>,
    businessId?: number
  ): Promise<ListResponse<s.lineitems.JSONSelectable>> {
    const lineItemsSql = db.sql<s.lineitems.SQL | s.jobs.SQL | s.clients.SQL, Array<{ result: s.lineitems.JSONSelectable }>>`
      SELECT to_jsonb(l.*) as result
      FROM ${'clients'} c
      JOIN ${'jobs'} j
      ON j.${'client_id'} = c.${'id'}
      JOIN
      (SELECT *
      FROM ${'lineitems'}
      WHERE ${{ ...lineItem }}) l
      ON l.${'job_id'} = j.${'id'}
      WHERE c.${'business_id'} = ${db.param(businessId)}
      ORDER BY ${db.param(options?.orderBy || 'created')} ${db.raw(options?.orderDirection || 'DESC')}
      LIMIT ${db.param(options?.limit || 20)}
      OFFSET ${db.param(options?.offset || 0)}`

    const lineItemsPromise = lineItemsSql.run(this.pool)

    const countSql = db.sql<s.lineitems.SQL | s.jobs.SQL | s.clients.SQL, Array<{ result: number }>>`
      SELECT COUNT(p.*)::int AS result
      FROM ${'clients'} c
      JOIN ${'jobs'} j
      ON j.${'client_id'} = c.${'id'}
      JOIN
      (SELECT *
      FROM ${'lineitems'}
      WHERE ${{ ...lineItem }}) p
      ON p.${'client_id'} = c.${'id'}
      WHERE c.${'business_id'} = ${db.param(businessId)}`
    const countPromise = countSql.run(this.pool)

    const [totalCount, jobs] = await Promise.all([countPromise, lineItemsPromise])
    return [totalCount[0].result, jobs?.map(job => job.result)]
  }

  async get (_userId: string, id: number, businessId: number) {
    return db.selectOne(
      'clients', { business_id: businessId }, {
        lateral: db.selectExactlyOne('jobs', {},
          { lateral: db.selectExactlyOne('lineitems', { job_id: db.parent('id'), id }) })
      }
    ).run(this.pool)
  }
}

export default LineItemRepository
