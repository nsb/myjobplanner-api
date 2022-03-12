import { Pool } from 'pg'
import * as db from 'zapatos/db';
import * as s from 'zapatos/schema';
import logger from '../logger';
import type { defaultQueryParams, ListResponse } from '../types';

export interface IClientRepository {
  create(userId: string, client: s.clients.Insertable): Promise<s.clients.JSONSelectable>
  find(userId: string, business?: s.clients.Whereable, extraParams?: defaultQueryParams<s.clients.Table>): Promise<ListResponse<s.clients.JSONSelectable>>
  getById(userId: string, id: number): Promise<s.clients.JSONSelectable | undefined>
}

class ClientRepository implements IClientRepository {
  constructor(private pool: Pool) { }
  public static inject = ['pool'] as const

  async create(userId: string, client: s.clients.Insertable): Promise<s.clients.JSONSelectable> {

    return db.readCommitted(this.pool, async txnClient => {

      // Check if we are admin for business
      const businessesSql = db.selectOne('employees', { user_id: userId, business_id: client.business_id, role: 'admin' }, {
        lateral: db.selectExactlyOne('businesses', { id: db.parent('business_id') },
        ),
      })
      logger.debug(businessesSql.compile())
      const business = await businessesSql.run(txnClient)

      if (!business) {
        throw Error("Invalid business Id!")
      }

      const createdClientSql = db.insert('clients', client)
      logger.debug(createdClientSql.compile())
      return await createdClientSql.run(txnClient)
    })
  }

  async find(
    userId: string,
    client?: s.clients.Whereable,
    { limit, offset, orderBy, orderDirection }: defaultQueryParams<s.clients.Table> = { limit: 20, offset: 0, orderBy: 'created', orderDirection: 'DESC' }
  ): Promise<ListResponse<s.clients.JSONSelectable>> {

    const clientsSql = db.sql<s.clients.SQL | s.employees.SQL, s.clients.JSONSelectable[]>`
      SELECT c.* FROM ${'employees'} JOIN
      (SELECT *
      FROM ${"clients"}
      WHERE ${{ ...client }}) AS c
      ON c.${'business_id'} = ${"employees"}.${"business_id"}
      WHERE ${"employees"}.${"user_id"} = ${db.param(userId)}
      ORDER BY ${db.param(orderBy)} ${db.raw(orderDirection)}
      LIMIT ${db.param(limit)}
      OFFSET ${db.param(offset)}`

    logger.debug(clientsSql.compile())
    const clientsPromise = clientsSql.run(this.pool)

    const countSql = db.sql<s.clients.SQL | s.employees.SQL, Array<{ result: number }>>`
      SELECT COUNT(*)::int AS result
      FROM ${'employees'} JOIN
      (SELECT *
      FROM ${"clients"}
      WHERE ${{ ...client }}) AS c
      ON c.${'business_id'} = ${"employees"}.${"business_id"}
      WHERE ${"employees"}.${"user_id"} = ${db.param(userId)}`
    logger.debug(countSql.compile())
    const countPromise = countSql.run(this.pool)

    const [totalCount, clients] = await Promise.all([countPromise, clientsPromise])

    return { totalCount: totalCount[0].result, result: clients?.filter(client => client != null) }
  }

  async getById(userId: string, id: number): Promise<s.clients.JSONSelectable | undefined> {
    return await db.selectOne('employees', { user_id: userId }, {
      lateral: db.selectExactlyOne('clients', { business_id: db.parent('business_id'), id })
    }).run(this.pool)
  }
}

export default ClientRepository