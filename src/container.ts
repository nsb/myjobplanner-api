import { createInjector } from 'typed-inject'
import pool from './postgres'
import BusinessController, { BusinessTransformer, fromQuery as fromBusinessQuery } from './controllers/business.controllers'
import BusinessRepository from './repositories/BusinessRepository'
import ClientController, { ClientTransformer, fromQuery as fromClientQuery } from './controllers/client.controllers'
import ClientRepository from './repositories/ClientRepository'
import PropertyController, { PropertyTransformer, fromQuery as fromPropertyQuery } from './controllers/property.controllers'
import PropertyRepository from './repositories/PropertyRepository'
import HealthController from './controllers/health.controllers'

const container = createInjector()
  .provideValue('pool', pool)
  .provideValue('businessQuery', fromBusinessQuery)
  .provideClass('businessTransformer', BusinessTransformer)
  .provideClass('businessRepository', BusinessRepository)
  .provideClass('businessController', BusinessController)
  .provideValue('clientQuery', fromClientQuery)
  .provideClass('clientTransformer', ClientTransformer)
  .provideClass('clientRepository', ClientRepository)
  .provideClass('clientController', ClientController)
  .provideValue('propertyQuery', fromPropertyQuery)
  .provideClass('propertyTransformer', PropertyTransformer)
  .provideClass('propertyRepository', PropertyRepository)
  .provideClass('propertyController', PropertyController)
  .provideClass('healthController', HealthController)

export default container