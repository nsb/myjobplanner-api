import { createInjector } from 'typed-inject'
import pool from './postgres'
import BusinessController, { BusinessTransformer } from './controllers/business.controllers'
import BusinessRepository from './repositories/BusinessRepository'
import ClientController, { ClientTransformer } from './controllers/client.controllers'
import ClientRepository from './repositories/ClientRepository'
import PropertyController, { PropertyTransformer } from './controllers/property.controllers'
import PropertyRepository from './repositories/PropertyRepository'
import HealthController from './controllers/health.controllers'

const container = createInjector()
  .provideValue('pool', pool)
  .provideClass('businessTransformer', BusinessTransformer)
  .provideClass('businessRepository', BusinessRepository)
  .provideClass('businessController', BusinessController)
  .provideClass('clientTransformer', ClientTransformer)
  .provideClass('clientRepository', ClientRepository)
  .provideClass('clientController', ClientController)
  .provideClass('propertyTransformer', PropertyTransformer)
  .provideClass('propertyRepository', PropertyRepository)
  .provideClass('propertyController', PropertyController)
  .provideClass('healthController', HealthController)

export default container