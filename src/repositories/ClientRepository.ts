import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import logger from '../logger'
import type { RepositoryOptions, ListResponse } from '../types'
import type { IRepository } from '../repositories/BaseRepository'

export type IClientRepository = IRepository<
  s.clients.Insertable,
  s.clients.Updatable,
  s.clients.JSONSelectable,
  s.clients.Whereable,
  s.clients.Table
>

class ClientRepository implements IClientRepository {
  constructor (private pool: Pool) { }
  public static inject = ['pool'] as const

  async create (userId: string, client: s.clients.Insertable): Promise<s.clients.JSONSelectable> {
    return db.readCommitted(this.pool, async txnClient => {
      // Check if we are admin for business
      const businessesSql = db.selectOne('employees', { user_id: userId, business_id: client.business_id, role: 'admin' }, {
        lateral: db.selectExactlyOne('businesses', { id: db.parent('business_id') }
        )
      })
      logger.debug(businessesSql.compile())
      const business = await businessesSql.run(txnClient)

      if (!business) {
        throw Error('Invalid business Id!')
      }

      const createdClientSql = db.insert('clients', client)
      logger.debug(createdClientSql.compile())
      return await createdClientSql.run(txnClient)
    })
  }

  async update (userId: string, id: number, client: s.clients.Updatable): Promise<s.clients.JSONSelectable> {
    return db.readCommitted(this.pool, async txnClient => {
      const updatedBusiness = await db.update('clients', client, { id }).run(txnClient)
      return updatedBusiness[0]
    })
  }

  async find (
    userId: string,
    client?: s.clients.Whereable,
    options?: RepositoryOptions<s.clients.Table>
  ): Promise<ListResponse<s.clients.JSONSelectable>> {
    const clientsSql = db.sql < s.clients.SQL | s.employees.SQL, Array<{ result: s.clients.JSONSelectable }>>`
      SELECT to_jsonb(c.*) as result
      FROM ${'employees'} JOIN
      (SELECT *
      FROM ${'clients'}
      WHERE ${{ ...client }}) AS c
      ON c.${'business_id'} = ${'employees'}.${'business_id'}
      WHERE ${'employees'}.${'user_id'} = ${db.param(userId)}
      ORDER BY ${db.param(options?.orderBy || 'created')} ${db.raw(options?.orderDirection || 'DESC')}
      LIMIT ${db.param(options?.limit || 20)}
      OFFSET ${db.param(options?.offset || 0)}`

    logger.debug(clientsSql.compile())
    const clientsPromise = clientsSql.run(this.pool)

    const countSql = db.sql<s.clients.SQL | s.employees.SQL, Array<{ result: number }>>`
      SELECT COUNT(*)::int AS result
      FROM ${'employees'} JOIN
      (SELECT *
      FROM ${'clients'}
      WHERE ${{ ...client }}) AS c
      ON c.${'business_id'} = ${'employees'}.${'business_id'}
      WHERE ${'employees'}.${'user_id'} = ${db.param(userId)}`
    logger.debug(countSql.compile())
    const countPromise = countSql.run(this.pool)

    const [totalCount, clients] = await Promise.all([countPromise, clientsPromise])

    return { totalCount: totalCount[0].result, result: clients?.map(client => client.result) }
  }

  async get (userId: string, id: number): Promise<s.clients.JSONSelectable | undefined> {
    return await db.selectOne('employees', { user_id: userId }, {
      lateral: db.selectExactlyOne('clients', { business_id: db.parent('business_id'), id })
    }).run(this.pool)
  }
}

export default ClientRepository
