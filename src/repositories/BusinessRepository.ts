import { Pool } from 'pg'
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';

class BusinessRepository {
  constructor(private pool: Pool) { }
  public static inject = ['pool'] as const

  async create(business: s.businesses.Insertable): Promise<s.businesses.JSONSelectable> {
    return await db.insert('businesses', business).run(this.pool)
  }

  async find(business: s.businesses.Whereable): Promise<Array<s.businesses.JSONSelectable>> {

    const userBusinesses = await db.selectOne('users', { user_id: 'abc' }, {
      lateral: {
        businesses: db.select('employees', { user_id: db.parent('id') }, {
          lateral: db.selectExactlyOne('businesses', { ...business, id: db.parent('business_id') })
        })
      }
    }).run(this.pool)

    return (userBusinesses?.businesses || []).filter(business => business != null)
  }
}

export default BusinessRepository