import { createInjector } from 'typed-inject'
import pool from './postgres'
import { BusinessController } from './controllers/business.controllers'
import BusinessRepository from './repositories/BusinessRepository'

const container = createInjector()
  .provideValue('pool', pool)
  .provideClass('businessRepository', BusinessRepository)
  .provideClass('businessController', BusinessController)

export default container