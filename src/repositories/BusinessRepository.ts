import { Pool } from 'pg'
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';

export interface IBusinessRepository {
  create(user_id: string, business: s.businesses.Insertable): Promise<s.businesses.JSONSelectable>
  find(user_id: string, business?: s.businesses.Whereable): Promise<s.businesses.JSONSelectable[]>
}

class BusinessRepository implements IBusinessRepository {
  constructor(private pool: Pool) { }
  public static inject = ['pool'] as const

  async create(user_id: string, business: s.businesses.Insertable): Promise<s.businesses.JSONSelectable> {

    return db.readCommitted(this.pool, async txnClient => {
      const createdBusiness = await db.insert('businesses', business).run(txnClient)

      const employee: s.employees.Insertable = {
        user_id,
        business_id: createdBusiness.id,
        role: 'admin'
      }

      await db.sql<s.employees.SQL, s.employees.Selectable>`
          INSERT INTO ${"employees"} (${db.cols(employee)})
          VALUES (${db.vals(employee)})`.run(txnClient)

      return createdBusiness
    })
  }

  async find(user_id: string, business?: s.businesses.Whereable): Promise<Array<s.businesses.JSONSelectable>> {

    const businesses = await db.select('employees', { user_id }, {
      lateral: db.selectExactlyOne('businesses', { ...business, id: db.parent('business_id') })
    }).run(this.pool)

    return businesses?.filter(business => business != null)
  }
}

export default BusinessRepository