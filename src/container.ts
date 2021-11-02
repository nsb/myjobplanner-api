import { createInjector } from 'typed-inject'
import pool from './postgres'
import { BusinessController } from './controllers/business.controllers'
import BusinessRepository from './repositories/BusinessRepository'
import HealthController from './controllers/health.controllers'

const container = createInjector()
  .provideValue('pool', pool)
  .provideClass('businessRepository', BusinessRepository)
  .provideClass('businessController', BusinessController)
  .provideClass('healthController', HealthController)

export default container