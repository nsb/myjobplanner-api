import { createInjector } from 'typed-inject'
import pool from './postgres'
import BusinessController from './controllers/business.controllers'
import BusinessService from './services/business.service'
import BusinessRepository from './repositories/BusinessRepository'
import ClientController from './controllers/client.controllers'
import ClientService from './services/client.service'
import ClientRepository from './repositories/ClientRepository'
import PropertyController from './controllers/property.controllers'
import PropertyService from './services/property.service'
import PropertyRepository from './repositories/PropertyRepository'
import JobRepository from './repositories/JobRepository'
import JobService from './services/job.service'
import JobController from './controllers/job.controllers'
import EmployeeRepository from './repositories/EmployeRepository'
import EmployeeService from './services/employee.service'
import EmployeeController from './controllers/employee.controllers'
import VisitRepository from './repositories/VisitRepository'
import VisitService from './services/visit.service'
import VisitController from './controllers/visit.controllers'
import poolDecorator from './authorization'
import openApi from './openapi'
import checkJwt from './jwt'
import LineItemRepository from './repositories/LineItemRepository'
import LineItemOverrideRepository from './repositories/LineItemOverrideRepository'

const baseContainer = createInjector()
  .provideValue('pool', pool)
  .provideFactory('authorization', poolDecorator)
  .provideValue('openApi', openApi)
  .provideValue('checkJwt', checkJwt)

export const businessRoutesContainer = baseContainer
  .provideClass('employeeRepository', EmployeeRepository)
  .provideClass('businessRepository', BusinessRepository)
  .provideClass('businessService', BusinessService)
  .provideClass('businessController', BusinessController)

export const employeeRoutesContainer = baseContainer
  .provideClass('employeeRepository', EmployeeRepository)
  .provideClass('employeeService', EmployeeService)
  .provideClass('employeeController', EmployeeController)

export const clientRoutesContainer = baseContainer
  .provideClass('clientRepository', ClientRepository)
  .provideClass('clientService', ClientService)
  .provideClass('clientController', ClientController)

export const propertyRoutesContainer = baseContainer
  .provideClass('propertyRepository', PropertyRepository)
  .provideClass('propertyService', PropertyService)
  .provideClass('propertyController', PropertyController)

export const jobRoutesContainer = baseContainer
  .provideClass('jobRepository', JobRepository)
  .provideClass('lineItemRepository', LineItemRepository)
  .provideClass('jobService', JobService)
  .provideClass('jobController', JobController)

export const visitRoutesContainer = baseContainer
  .provideClass('lineItemRepository', LineItemRepository)
  .provideClass('lineItemOverrideRepository', LineItemOverrideRepository)
  .provideClass('visitRepository', VisitRepository)
  .provideClass('visitService', VisitService)
  .provideClass('visitController', VisitController)
