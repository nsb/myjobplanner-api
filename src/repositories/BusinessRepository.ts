import { Pool } from 'pg'
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';

type defaultQueryParams = {
  limit: number,
  offset: number
}

export interface IBusinessRepository {
  create(userId: string, business: s.businesses.Insertable): Promise<s.businesses.JSONSelectable>
  find(userId: string, business?: s.businesses.Whereable, extraParams?: defaultQueryParams): Promise<s.businesses.JSONSelectable[]>
  getById(userId: string, id: number): Promise<s.businesses.JSONSelectable>
}

class BusinessRepository implements IBusinessRepository {
  constructor(private pool: Pool) { }
  public static inject = ['pool'] as const

  async create(userId: string, business: s.businesses.Insertable): Promise<s.businesses.JSONSelectable> {

    return db.readCommitted(this.pool, async txnClient => {
      const createdBusiness = await db.insert('businesses', business).run(txnClient)

      const employee: s.employees.Insertable = {
        user_id: userId,
        business_id: createdBusiness.id,
        role: 'admin'
      }

      await db.sql<s.employees.SQL, s.employees.Selectable>`
          INSERT INTO ${"employees"} (${db.cols(employee)})
          VALUES (${db.vals(employee)})`.run(txnClient)

      return createdBusiness
    })
  }

  async find(userId: string, business?: s.businesses.Whereable, { limit, offset }: defaultQueryParams = { limit: 20, offset: 0 }): Promise<s.businesses.JSONSelectable[]> {

    const businesses = await db.select('employees', { user_id: userId }, {
      lateral: db.selectExactlyOne('businesses', { ...business, id: db.parent('business_id') }),
      limit,
      offset
    }).run(this.pool)

    return businesses?.filter(business => business != null)
  }

  async getById(userId: string, id: number): Promise<s.businesses.JSONSelectable> {

    return await db.selectExactlyOne('employees', { user_id: userId, business_id: id }, {
      lateral: db.selectExactlyOne('businesses', { id: db.parent('business_id') })
    }).run(this.pool)

  }
}

export default BusinessRepository