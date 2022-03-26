import { createInjector } from 'typed-inject'
import pool from './postgres'
import { BusinessController } from './controllers/business.controllers'
import BusinessRepository from './repositories/BusinessRepository'
import ClientController, { ClientTransformer } from './controllers/client.controllers'
import ClientRepository from './repositories/ClientRepository'
import PropertyController from './controllers/property.controllers'
import PropertyRepository from './repositories/PropertyRepository'
import HealthController from './controllers/health.controllers'

const container = createInjector()
  .provideValue('pool', pool)
  .provideClass('businessRepository', BusinessRepository)
  .provideClass('businessController', BusinessController)
  .provideClass('clientTransformer', ClientTransformer)
  .provideClass('clientRepository', ClientRepository)
  .provideClass('clientController', ClientController)
  .provideClass('propertyRepository', PropertyRepository)
  .provideClass('propertyController', PropertyController)
  .provideClass('healthController', HealthController)

export default container