import { Pool } from 'pg'
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';

class BusinessRepository {
  constructor(private pool: Pool) { }
  public static inject = ['pool'] as const

  async create(user_id: string, business: s.businesses.Insertable): Promise<s.businesses.JSONSelectable> {

    return db.readCommitted(this.pool, async txnClient => {
      const createdBusiness = await db.insert('businesses', business).run(txnClient)

      const idCol = <const>['id']
      type userCols = s.users.OnlyCols<typeof idCol>
      const userQuery = db.sql<s.users.SQL, userCols[]>`
          (SELECT ${db.cols(idCol)} FROM ${"users"} WHERE ${"user_id"} = ${db.vals({ user_id })})`

      const employee: s.employees.Insertable = {
        user_id: userQuery,
        business_id: createdBusiness.id
      }

      await db.sql<s.employees.SQL, s.employees.Selectable>`
          INSERT INTO ${"employees"} (${"business_id"}, ${"user_id"})
          VALUES (${db.vals(employee)})`.run(txnClient)

      return createdBusiness
    })
  }

  async find(user_id: string, business?: s.businesses.Whereable): Promise<Array<s.businesses.JSONSelectable>> {

    const userBusinesses = await db.selectOne('users', { user_id }, {
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