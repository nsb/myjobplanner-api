import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IService } from './base.service'
import type { IBusinessRepository } from '../repositories/BusinessRepository'
import type { IEmployeeRepository } from '../repositories/EmployeRepository'

export interface IBusinessService extends IService<s.businesses.Insertable, s.businesses.Updatable, s.businesses.JSONSelectable> { }

class BusinessService implements IBusinessService {
    public static inject = ['pool', 'businessRepository', 'employeeRepository'] as const;
    constructor (
        private pool: Pool,
        private businessRepository: IBusinessRepository,
        private employeeRepository: IEmployeeRepository
    ) {}

    async create (userId: string, business: s.businesses.Insertable) {
      return db.readCommitted(this.pool, async txnClient => {
        const createdBusiness = await this.businessRepository.create(userId, business, undefined, txnClient)

        const employee: s.employees.Insertable = {
          user_id: userId,
          business_id: createdBusiness.id,
          role: 'admin'
        }

        await this.employeeRepository.create(userId, employee, undefined, txnClient)
        return createdBusiness
      })
    }

    async update (userId: string, id: number, business: s.businesses.Updatable, businessId?: number) {
      return db.readCommitted(this.pool, async txnClient => {
        return this.businessRepository.update(
          userId,
          id,
          business,
          businessId,
          txnClient
        )
      })
    }
}

export default BusinessService
