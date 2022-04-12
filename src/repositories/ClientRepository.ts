import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { RepositoryOptions, ListResponse } from '../types'
import type { IRepository } from '../repositories/BaseRepository'
import { TxnClientForReadCommitted } from 'zapatos/db'

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

  async create (_userId: string, client: s.clients.Insertable, _businessId?: number, txnClient?: TxnClientForReadCommitted) {
    const createdClientSql = db.insert('clients', client)
    return createdClientSql.run(txnClient || this.pool)
  }

  async update (_userId: string, id: number, client: s.clients.Updatable, businessId?: number, txnClient?: TxnClientForReadCommitted) {
    const clients = await db.update('clients', client, { id }).run(txnClient || this.pool)
    return clients[0]
  }

  async find (
    _userId: string,
    client?: s.clients.Whereable,
    options?: RepositoryOptions<s.clients.Table>
  ): Promise<ListResponse<s.clients.JSONSelectable>> {
    const clientsSql = db.select('clients', { ...client }, {
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      order: {
        by: options?.orderBy || 'created',
        direction: options?.orderDirection || 'DESC'
      }
    })

    const clientsPromise = clientsSql.run(this.pool)
    const countSql = db.count('clients', { ...client })
    const countPromise = countSql.run(this.pool)
    const [totalCount, clients] = await Promise.all([countPromise, clientsPromise])
    return [totalCount, clients.filter(client => client != null)]
  }

  async get (_userId: string, id: number, businessId: number) {
    return db.selectOne('clients', { business_id: businessId, id }).run(this.pool)
  }
}

export default ClientRepository
