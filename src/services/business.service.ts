import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import { injectable, inject } from 'inversify'
import { BaseService, IService } from './base.service'
import type { IBusinessRepository } from '../repositories/BusinessRepository'
import type { IEmployeeRepository } from '../repositories/EmployeRepository'

export interface IBusinessService extends IService<
  s.businesses.Insertable,
  s.businesses.Updatable,
  s.businesses.JSONSelectable,
  s.businesses.Whereable,
  s.businesses.Table
> { }

@injectable()
class BusinessService extends BaseService<
  s.businesses.Insertable,
  s.businesses.Updatable,
  s.businesses.JSONSelectable,
  s.businesses.Whereable,
  s.businesses.Table
> implements IBusinessService {
  constructor (
    @inject('pool') pool: Pool,
    @inject('businessRepository') repository: IBusinessRepository,
    @inject('employeeRepository') private employeeRepository: IEmployeeRepository
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

      await this.employeeRepository.create(userId, employee, createdBusiness.id, txnClient)
      return createdBusiness
    })
  }
}

export default BusinessService
