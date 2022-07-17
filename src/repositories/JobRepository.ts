import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IRepository } from './BaseRepository'
import type { RepositoryOptions, ListResponse } from '../types'
import { TxnClientForReadCommitted } from 'zapatos/db'

type JobRepositorySelectable = s.jobs.JSONSelectable & {
  lineitems?: s.lineitems.JSONSelectable[],
  assigned?: s.job_assignments.JSONSelectable[]
}

export type IJobRepository = IRepository<
    s.jobs.Insertable,
    s.jobs.Updatable,
    JobRepositorySelectable,
    s.jobs.Whereable,
    s.jobs.Table
>

class JobRepository implements IJobRepository {
  constructor (private pool: Pool) { }
  public static inject = ['pool'] as const

  async create (
    _userId: string,
    job: s.jobs.Insertable,
    businessId: number,
    txnClient?: TxnClientForReadCommitted
  ) {
    // validate related field client_id
    await db.selectExactlyOne(
      'clients', {
        business_id: businessId,
        id: job.client_id
      }).run(txnClient || this.pool)

    return db.insert('jobs', job).run(txnClient || this.pool)
  }

  async update (
    _userId: string,
    id: number,
    job: s.jobs.Updatable,
    businessId: number,
    txnClient?: TxnClientForReadCommitted
  ) {
    // validate related field client_id
    await db.selectExactlyOne(
      'clients', {
        business_id: businessId,
        id: job.client_id
      }).run(txnClient || this.pool)

    const updatedBusiness = await db.update(
      'jobs',
      job,
      { id }
    ).run(txnClient || this.pool)
    return updatedBusiness[0]
  }

  async find (
    _userId: string,
    job?: s.jobs.Whereable,
    options?: RepositoryOptions<s.jobs.Table>,
    businessId?: number
  ): Promise<ListResponse<JobRepositorySelectable>> {
    const jobsSql = db.sql<s.jobs.SQL | s.clients.SQL | s.lineitems.SQL, Array<{ result: Array<JobRepositorySelectable>}>>`
        SELECT coalesce(json_agg(b), '[]') AS result FROM (
        SELECT j.* FROM ${'clients'} c
        JOIN
        (SELECT * FROM jobs j,
          LATERAL (
            SELECT coalesce(json_agg(li), '[]') as lineitems FROM lineitems li
              WHERE li.${'job_id'} = j.${'id'}
          ) lineitems,
          LATERAL (
            SELECT coalesce(json_agg(ja), '[]') as assigned
            FROM job_assignments ja
            WHERE ja.job_id = j.id
          ) assigned
          WHERE ${{ ...job }}) j
          ON j.${'client_id'} = c.${'id'}
          WHERE c.${'business_id'} = ${db.param(businessId)}
          ORDER BY ${db.param(options?.orderBy || 'created')} ${db.raw(options?.orderDirection || 'DESC')}
          LIMIT ${db.param(options?.limit || 20)}
          OFFSET ${db.param(options?.offset || 0)}
          ) b`

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
    return [totalCount[0].result, jobs[0].result]
  }

  async get (_userId: string, id: number, _businessId: number) {
    return db.selectOne('jobs', { id }, {
      lateral: {
        lineitems: db.select('lineitems', { job_id: db.parent('id') }),
        assigned: db.select('job_assignments', { job_id: db.parent('id') })
      }
    }).run(this.pool)
  }
}

export default JobRepository
