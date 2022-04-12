import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IRepository } from './BaseRepository'
import type { RepositoryOptions, ListResponse } from '../types'
import { TxnClientForReadCommitted } from 'zapatos/db'

export type IJobRepository = IRepository<
    s.jobs.Insertable,
    s.jobs.Updatable,
    s.jobs.JSONSelectable,
    s.jobs.Whereable,
    s.jobs.Table
>

class JobRepository implements IJobRepository {
  constructor (private pool: Pool) { }
    public static inject = ['pool'] as const

    async create (
      _userId: string,
      job: s.jobs.Insertable,
      _businessId: number,
      txnClient?: TxnClientForReadCommitted
    ): Promise<s.jobs.JSONSelectable> {
      // // validate client id
      // await db.selectExactlyOne(
      //   'clients', {
      //     business_id: businessId,
      //     id: job.client_id
      //   }).run(txnClient || this.pool)

      // // validate property id
      // await db.selectExactlyOne(
      //   'properties', {
      //     client_id: job.client_id,
      //     id: job.property_id
      //   }).run(txnClient || this.pool)

      return db.insert('jobs', job).run(txnClient || this.pool)
    }

    async update (
      _userId: string,
      id: number,
      job: s.jobs.Updatable,
      _businessId: number,
      txnClient?: TxnClientForReadCommitted
    ): Promise<s.jobs.JSONSelectable> {
      // await db.selectExactlyOne(
      //   'clients', {
      //     business_id: businessId,
      //     id: job.client_id
      //   }).run(txnClient || this.pool)

      // // validate property id
      // await db.selectExactlyOne(
      //   'properties', {
      //     client_id: job.client_id,
      //     id: job.property_id
      //   }).run(txnClient || this.pool)

      const updatedBusiness = await db.update('jobs', job, { id }).run(txnClient || this.pool)
      return updatedBusiness[0]
    }

    async find (
      userId: string,
      job?: s.jobs.Whereable,
      options?: RepositoryOptions<s.jobs.Table>,
      businessId?: number
    ): Promise<ListResponse<s.jobs.JSONSelectable>> {
      const jobsSql = db.sql<s.jobs.SQL | s.clients.SQL, Array<{ result: s.jobs.JSONSelectable }>>`
      SELECT to_jsonb(p.*) as result
      FROM ${'clients'} c
      JOIN
      (SELECT *
      FROM ${'jobs'}
      WHERE ${{ ...job }}) p
      ON p.${'client_id'} = c.${'id'}
      WHERE c.${'business_id'} = ${db.param(businessId)}
      ORDER BY ${db.param(options?.orderBy || 'created')} ${db.raw(options?.orderDirection || 'DESC')}
      LIMIT ${db.param(options?.limit || 20)}
      OFFSET ${db.param(options?.offset || 0)}`

      const jobsPromise = jobsSql.run(this.pool)

      const countSql = db.sql<s.jobs.SQL | s.clients.SQL, Array<{ result: number }>>`
      SELECT COUNT(p.*)::int AS result
      FROM ${'clients'} c
      JOIN
      (SELECT *
      FROM ${'jobs'}
      WHERE ${{ ...job }}) p
      ON p.${'client_id'} = c.${'id'}
      WHERE c.${'business_id'} = ${db.param(businessId)}`
      const countPromise = countSql.run(this.pool)

      const [totalCount, jobs] = await Promise.all([countPromise, jobsPromise])

      return [totalCount[0].result, jobs?.map(job => job.result)]
    }

    async get (userId: string, id: number, businessId: number) {
      return db.selectOne(
        'clients',
        { business_id: businessId },
        { lateral: db.selectExactlyOne('jobs', { client_id: db.parent('id'), id }) }
      ).run(this.pool)
    }
}

export default JobRepository
