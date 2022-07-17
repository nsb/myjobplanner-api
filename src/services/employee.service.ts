import * as s from 'zapatos/schema'
import { BaseService, IService } from './base.service'

export interface IEmployeeService extends IService<
  s.employees.Insertable,
  s.employees.Updatable,
  s.employees.JSONSelectable,
  s.employees.Whereable,
  s.employees.Table> {}

class EmployeeService extends BaseService<
  s.employees.Insertable,
  s.employees.Updatable,
  s.employees.JSONSelectable,
  s.employees.Whereable,
  s.employees.Table> {
  public static inject = ['pool', 'employeeRepository'] as const
}

export default EmployeeService
