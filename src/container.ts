import { createInjector } from 'typed-inject'
import db from './postgres'
import { BusinessController } from './controllers/BusinessController'

const appInjector = createInjector()
  .provideValue('db', db)
  .provideClass('businessController', BusinessController)

export default appInjector