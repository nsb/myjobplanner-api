import { Pool } from 'pg'
import * as db from 'zapatos/db';
import * as s from 'zapatos/schema';
import logger from '../logger';
import type { RepositoryOptions, ListResponse } from '../types';

export interface IPropertyRepository {
    create(userId: string, property: s.properties.Insertable): Promise<s.properties.JSONSelectable>
    find(userId: string, business?: s.properties.Whereable, extraParams?: RepositoryOptions<s.properties.Table>): Promise<ListResponse<s.properties.JSONSelectable>>
    get(userId: string, id: number): Promise<s.properties.JSONSelectable | undefined>
}

class PropertyRepository implements IPropertyRepository {
    constructor(private pool: Pool) { }
    public static inject = ['pool'] as const

    async create(
        userId: string,
        property: s.properties.Insertable
    ): Promise<s.properties.JSONSelectable> {

        return db.readCommitted(this.pool, async txnClient => {

            // Check if we are admin for business
            const businessesSql = db.selectOne('employees', { user_id: userId, role: 'admin' }, {
                lateral: db.selectExactlyOne(
                    'clients',
                    { business_id: db.parent('business_id'), id: property.client_id },
                )
            })

            logger.debug(businessesSql.compile())
            const business = await businessesSql.run(txnClient)

            if (!business) {
                throw Error("Invalid business Id!")
            }

            const createdPropertySql = db.insert('properties', property)
            logger.debug(createdPropertySql.compile())
            return await createdPropertySql.run(txnClient)
        })
    }

    async find(
        userId: string,
        property?: s.properties.Whereable,
        options?: RepositoryOptions<s.properties.Table>
    ): Promise<ListResponse<s.properties.JSONSelectable>> {

        const propertiesSql = db.sql<s.properties.SQL | s.clients.SQL | s.employees.SQL, s.properties.JSONSelectable[]>`
      SELECT p.* FROM ${"employees"} e
      JOIN ${"clients"} c
      ON c.${"business_id"} = e.${"business_id"}
      JOIN
      (SELECT *
      FROM ${"properties"}
      WHERE ${{ ...property }}) p
      ON p.${"client_id"} = c.${"id"}
      WHERE e.${"user_id"} = ${db.param(userId)}
      ORDER BY ${db.param(options?.orderBy || 'created')} ${db.raw(options?.orderDirection || 'DESC')}
      LIMIT ${db.param(options?.limit || 20)}
      OFFSET ${db.param(options?.offset || 0)}`

        logger.debug(propertiesSql.compile())
        const propertiesPromise = propertiesSql.run(this.pool)

        const countSql = db.sql<s.properties.SQL | s.clients.SQL | s.employees.SQL, Array<{ result: number }>>`
      SELECT COUNT(p.*)::int AS result
      FROM ${'employees'} e
      JOIN ${"clients"} c
      ON c.${"business_id"} = e.${"business_id"}
      JOIN
      (SELECT *
      FROM ${"properties"}
      WHERE ${{ ...property }}) p
      ON p.${"client_id"} = c.${"id"}
      WHERE e.${"user_id"} = ${db.param(userId)}`
        logger.debug(countSql.compile())
        const countPromise = countSql.run(this.pool)

        const [totalCount, properties] = await Promise.all([countPromise, propertiesPromise])

        return { totalCount: totalCount[0].result, result: properties?.filter(property => property != null) }
    }

    async get(userId: string, id: number): Promise<s.properties.JSONSelectable | undefined> {
        const getSql = db.selectOne('employees', { user_id: userId }, {
            lateral: db.selectExactlyOne(
                'clients',
                { business_id: db.parent('business_id') },
                { lateral: db.selectExactlyOne('properties', { client_id: db.parent('id') }) })
        })

        logger.debug(getSql.compile())
        return await getSql.run(this.pool)
    }
}

export default PropertyRepository