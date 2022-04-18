import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import { BaseService, IService } from './base.service'
import type { IBusinessRepository } from '../repositories/BusinessRepository'
import type { IEmployeeRepository } from '../repositories/EmployeRepository'

export interface IBusinessService extends IService<s.businesses.Insertable, s.businesses.Updatable, s.businesses.JSONSelectable, s.businesses.Whereable, s.businesses.Table> { }

class BusinessService extends BaseService<s.businesses.Insertable, s.businesses.Updatable, s.businesses.JSONSelectable, s.businesses.Whereable, s.businesses.Table> {
    public static inject = ['pool', 'businessRepository', 'employeeRepository'] as const;
    constructor (
      pool: Pool,
      repository: IBusinessRepository,
      private employeeRepository: IEmployeeRepository
    ) {
      super(pool, repository)
    }

    async create (userId: string, business: s.businesses.Insertable) {
      return db.readCommitted(this.pool, async txnClient => {
        const createdBusiness = await this.repository.create(userId, business, undefined, txnClient)

        const employee: s.employees.Insertable = {
          user_id: userId,
          business_id: createdBusiness.id,
          role: 'admin'
        }

        await this.employeeRepository.create(userId, employee, undefined, txnClient)
        return createdBusiness
      })
    }
}

export default BusinessService
