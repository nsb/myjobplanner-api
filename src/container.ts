import { createInjector } from 'typed-inject'
import pool, { DbPool } from './postgres'
import { BusinessController } from './controllers/business.controllers'

const container = createInjector()
  .provideValue('pool', pool)
  .provideClass('dbPool', DbPool)
  .provideClass('businessController', BusinessController)

export default container