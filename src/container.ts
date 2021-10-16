import { createInjector } from 'typed-inject'
import pool, { DbPool } from './postgres'
import { BusinessController } from './controllers/BusinessController'

const appInjector = createInjector()
  .provideValue('pool', pool)
  .provideClass('dbPool', DbPool)
  .provideClass('businessController', BusinessController)

export default appInjector