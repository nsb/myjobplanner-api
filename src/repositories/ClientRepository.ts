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
    let where
    if (options?.businessId) {
      where = { ...client, business_id: options.businessId }
    } else {
      where = client
    }
    const clientsSql = db.select('clients', { ...where }, {
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      order: {
        by: options?.orderBy || 'created',
        direction: options?.orderDirection || 'DESC'
      }
    })

    logger.debug(clientsSql.compile())
    const clientsPromise = clientsSql.run(this.pool)

    const countSql = db.count('clients', { ...where })
    logger.debug(countSql.compile())
    const countPromise = countSql.run(this.pool)

    const [totalCount, clients] = await Promise.all([countPromise, clientsPromise])

    return { totalCount, result: clients.filter(client => client != null) }
  }

  async get (userId: string, id: number): Promise<s.clients.JSONSelectable | undefined> {
    return await db.selectOne('employees', { user_id: userId }, {
      lateral: db.selectExactlyOne('clients', { business_id: db.parent('business_id'), id })
    }).run(this.pool)
  }
}

export default ClientRepository
