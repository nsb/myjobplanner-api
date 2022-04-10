import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IRepository } from './BaseRepository'
import type { RepositoryOptions, ListResponse } from '../types'

export type IPropertyRepository = IRepository<
  s.properties.Insertable,
  s.properties.Updatable,
  s.properties.JSONSelectable,
  s.properties.Whereable,
  s.properties.Table
>

class PropertyRepository implements IPropertyRepository {
  constructor (private pool: Pool) { }
  public static inject = ['pool'] as const

  async create (
    userId: string,
    property: s.properties.Insertable,
    businessId: number
  ): Promise<s.properties.JSONSelectable> {
    return db.readCommitted(this.pool, async txnClient => {
      // validate client id
      await db.selectExactlyOne(
        'clients', {
          business_id: businessId,
          id: property.client_id
        }).run(txnClient)

      const createdPropertySql = db.insert('properties', property)
      return await createdPropertySql.run(txnClient)
    })
  }

  async update (
    userId: string,
    id: number,
    property: s.properties.Updatable,
    businessId: number
  ): Promise<s.properties.JSONSelectable> {
    return db.readCommitted(this.pool, async txnClient => {
      // validate client id
      await db.selectExactlyOne(
        'clients', {
          business_id: businessId,
          id: property.client_id
        }).run(txnClient)
      const updatedBusiness = await db.update('properties', property, { id }).run(txnClient)
      return updatedBusiness[0]
    })
  }

  async find (
    userId: string,
    property?: s.properties.Whereable,
    options?: RepositoryOptions<s.properties.Table>,
    businessId?: number
  ): Promise<ListResponse<s.properties.JSONSelectable>> {
    const propertiesSql = db.sql<s.properties.SQL | s.clients.SQL, Array<{ result: s.properties.JSONSelectable }>>`
      SELECT to_jsonb(p.*) as result
      FROM ${'clients'} c
      JOIN
      (SELECT *
      FROM ${'properties'}
      WHERE ${{ ...property }}) p
      ON p.${'client_id'} = c.${'id'}
      WHERE c.${'business_id'} = ${db.param(businessId)}
      ORDER BY ${db.param(options?.orderBy || 'created')} ${db.raw(options?.orderDirection || 'DESC')}
      LIMIT ${db.param(options?.limit || 20)}
      OFFSET ${db.param(options?.offset || 0)}`
    const propertiesPromise = propertiesSql.run(this.pool)

    const countSql = db.sql<s.properties.SQL | s.clients.SQL | s.employees.SQL, Array<{ result: number }>>`
      SELECT COUNT(p.*)::int AS result
      FROM ${'clients'} c
      JOIN
      (SELECT *
      FROM ${'properties'}
      WHERE ${{ ...property }}) p
      ON p.${'client_id'} = c.${'id'}
      WHERE c.${'business_id'} = ${db.param(businessId)}`
    const countPromise = countSql.run(this.pool)

    const [totalCount, properties] = await Promise.all([countPromise, propertiesPromise])

    return { totalCount: totalCount[0].result, result: properties?.map(property => property.result) }
  }

  async get (userId: string, id: number, businessId: number): Promise<s.properties.JSONSelectable | undefined> {
    return db.selectExactlyOne(
      'clients',
      { business_id: businessId },
      { lateral: db.selectExactlyOne('properties', { client_id: db.parent('id') }) }
    ).run(this.pool)
  }
}

export default PropertyRepository
