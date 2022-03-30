import { Pool } from 'pg'
import * as db from 'zapatos/db';
import * as s from 'zapatos/schema';
import logger from '../logger';
import type { RepositoryOptions, ListResponse } from '../types';

export interface IJobRepository {
    create(userId: string, job: s.jobs.Insertable): Promise<s.jobs.JSONSelectable>
    find(userId: string, business?: s.jobs.Whereable, extraParams?: RepositoryOptions<s.jobs.Table>): Promise<ListResponse<s.jobs.JSONSelectable>>
    get(userId: string, id: number): Promise<s.jobs.JSONSelectable | undefined>
}

class JobRepository implements IJobRepository {
    constructor(private pool: Pool) { }
    public static inject = ['pool'] as const

    async create(
        userId: string,
        job: s.jobs.Insertable
    ): Promise<s.jobs.JSONSelectable> {

        return db.readCommitted(this.pool, async txnClient => {

            // Check if we are admin for business
            const businessesSql = db.selectOne('employees', { user_id: userId, role: 'admin' }, {
                lateral: db.selectExactlyOne(
                    'clients',
                    { business_id: db.parent('business_id'), id: job.client_id },
                )
            })

            logger.debug(businessesSql.compile())
            const business = await businessesSql.run(txnClient)

            if (!business) {
                throw Error("Invalid business Id!")
            }

            const createdJobSql = db.insert('jobs', job)
            logger.debug(createdJobSql.compile())
            return await createdJobSql.run(txnClient)
        })
    }

    async find(
        userId: string,
        job?: s.jobs.Whereable,
        options?: RepositoryOptions<s.jobs.Table>
    ): Promise<ListResponse<s.jobs.JSONSelectable>> {

        const jobsSql = db.sql<s.jobs.SQL | s.clients.SQL | s.employees.SQL, s.jobs.JSONSelectable[]>`
      SELECT p.* FROM ${"employees"} e
      JOIN ${"clients"} c
      ON c.${"business_id"} = e.${"business_id"}
      JOIN
      (SELECT *
      FROM ${"jobs"}
      WHERE ${{ ...job }}) p
      ON p.${"client_id"} = c.${"id"}
      WHERE e.${"user_id"} = ${db.param(userId)}
      ORDER BY ${db.param(options?.orderBy || 'created')} ${db.raw(options?.orderDirection || 'DESC')}
      LIMIT ${db.param(options?.limit || 20)}
      OFFSET ${db.param(options?.offset || 0)}`

        logger.debug(jobsSql.compile())
        const jobsPromise = jobsSql.run(this.pool)

        const countSql = db.sql<s.jobs.SQL | s.clients.SQL | s.employees.SQL, Array<{ result: number }>>`
      SELECT COUNT(p.*)::int AS result
      FROM ${'employees'} e
      JOIN ${"clients"} c
      ON c.${"business_id"} = e.${"business_id"}
      JOIN
      (SELECT *
      FROM ${"jobs"}
      WHERE ${{ ...job }}) p
      ON p.${"client_id"} = c.${"id"}
      WHERE e.${"user_id"} = ${db.param(userId)}`
        logger.debug(countSql.compile())
        const countPromise = countSql.run(this.pool)

        const [totalCount, jobs] = await Promise.all([countPromise, jobsPromise])

        return { totalCount: totalCount[0].result, result: jobs?.filter(job => job != null) }
    }

    async get(userId: string, id: number): Promise<s.jobs.JSONSelectable | undefined> {
        const getSql = db.selectOne('employees', { user_id: userId }, {
            lateral: db.selectExactlyOne(
                'clients',
                { business_id: db.parent('business_id') },
                { lateral: db.selectExactlyOne('jobs', { client_id: db.parent('id') }) })
        })

        logger.debug(getSql.compile())
        return await getSql.run(this.pool)
    }
}

export default JobRepository