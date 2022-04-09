import { createInjector } from 'typed-inject'
import pool from './postgres'
import BusinessController from './controllers/business.controllers'
import BusinessRepository from './repositories/BusinessRepository'
import ClientController from './controllers/client.controllers'
import ClientRepository from './repositories/ClientRepository'
import PropertyController from './controllers/property.controllers'
import PropertyRepository from './repositories/PropertyRepository'
import JobRepository from './repositories/JobRepository'
import JobController from './controllers/job.controllers'
import HealthController from './controllers/health.controllers'

const container = createInjector()
  .provideValue('pool', pool)
  .provideClass('businessRepository', BusinessRepository)
  .provideClass('businessController', BusinessController)
  .provideClass('clientRepository', ClientRepository)
  .provideClass('clientController', ClientController)
  .provideClass('propertyRepository', PropertyRepository)
  .provideClass('propertyController', PropertyController)
  .provideClass('jobRepository', JobRepository)
  .provideClass('jobController', JobController)
  .provideClass('healthController', HealthController)

export default container