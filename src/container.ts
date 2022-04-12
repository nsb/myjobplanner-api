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
import HealthController from './controllers/health.controllers'
import poolDecorator from './authorization'
import openApi from './openapi'
import checkJwt from './jwt'
import LineItemRepository from './repositories/LineItemRepository'

const container = createInjector()
  .provideValue('pool', pool)
  .provideClass('employeeRepository', EmployeeRepository)
  .provideClass('businessRepository', BusinessRepository)
  .provideClass('businessService', BusinessService)
  .provideClass('businessController', BusinessController)
  .provideClass('clientRepository', ClientRepository)
  .provideClass('clientService', ClientService)
  .provideClass('clientController', ClientController)
  .provideClass('propertyRepository', PropertyRepository)
  .provideClass('propertyService', PropertyService)
  .provideClass('propertyController', PropertyController)
  .provideClass('jobRepository', JobRepository)
  .provideClass('lineItemRepository', LineItemRepository)
  .provideClass('jobService', JobService)
  .provideClass('jobController', JobController)
  .provideClass('healthController', HealthController)
  .provideFactory('authorization', poolDecorator)
  .provideValue('openApi', openApi)
  .provideValue('checkJwt', checkJwt)

export default container
