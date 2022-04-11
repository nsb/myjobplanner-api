import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { RepositoryOptions } from '../types'
import type { IRepository } from './BaseRepository'

export interface IEmployeeRepository extends IRepository<
  s.employees.Insertable,
  s.employees.Updatable,
  s.employees.JSONSelectable,
  s.employees.Whereable,
  s.employees.Table
> { }

class EmployeeRepository implements IEmployeeRepository {
  constructor (private pool: Pool) { }
  public static inject = ['pool'] as const

  async create (userId: string, employee: s.employees.Insertable, businessId?: number, txnClient?: db.TxnClientForReadCommitted) {
    return db.insert('employees', employee).run(txnClient || this.pool)
  }

  async update (_userId: string, id: number, business: s.employees.Updatable) {
    return db.readCommitted(this.pool, async txnClient => {
      const updatedBusiness = await db.update('employees', business, { id }).run(txnClient)
      return updatedBusiness[0]
    })
  }

  async find (
    userId: string,
    business?: s.employees.Whereable,
    options?: RepositoryOptions<s.employees.Table>
  ) {
    const employeesSql = db.select('employees', { user_id: userId }, {
      limit: options?.limit || 20,
      offset: options?.offset || 0,
      order: {
        by: db.sql`result->'${options?.orderBy || 'created'}'`,
        direction: options?.orderDirection || 'DESC'
      },
      lateral: db.selectExactlyOne('employees', { ...business, id: db.parent('business_id') }
      )
    })
    const employeesPromise = employeesSql.run(this.pool)

    const countSql = db.sql<s.employees.SQL | s.employees.SQL, Array<{ result: number }>>`
      SELECT COUNT(*)::int AS result
      FROM ${'employees'} JOIN ${'employees'}
      ON ${'employees'}.${'id'} = ${'employees'}.${'business_id'}
      WHERE ${{ ...business, user_id: userId }}`
    const countPromise = countSql.run(this.pool)

    const [totalCount, employees] = await Promise.all([countPromise, employeesPromise])

    return { totalCount: totalCount[0].result, result: employees?.filter(employee => employee != null) }
  }

  async get (userId: string, id: number) {
    return db.selectOne('employees', { user_id: userId, business_id: id }).run(this.pool)
  }
}

export default EmployeeRepository
