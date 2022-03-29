import { createInjector } from 'typed-inject'
import pool from './postgres'
import BusinessController, { BusinessTransformer, fromQuery as fromBusinessQuery, getBusinessOrderBy } from './controllers/business.controllers'
import BusinessRepository from './repositories/BusinessRepository'
import ClientController, { ClientTransformer, fromQuery as fromClientQuery, getClientOrderBy } from './controllers/client.controllers'
import ClientRepository from './repositories/ClientRepository'
import PropertyController, { PropertyTransformer, fromQuery as fromPropertyQuery, getPropertyOrderBy } from './controllers/property.controllers'
import PropertyRepository from './repositories/PropertyRepository'
import HealthController from './controllers/health.controllers'

const container = createInjector()
  .provideValue('pool', pool)
  .provideValue('businessQuery', fromBusinessQuery)
  .provideValue('getBusinessOrderBy', getBusinessOrderBy)
  .provideClass('businessTransformer', BusinessTransformer)
  .provideClass('businessRepository', BusinessRepository)
  .provideClass('businessController', BusinessController)
  .provideValue('getClientOrderBy', getClientOrderBy)
  .provideValue('clientQuery', fromClientQuery)
  .provideClass('clientTransformer', ClientTransformer)
  .provideClass('clientRepository', ClientRepository)
  .provideClass('clientController', ClientController)
  .provideValue('getPropertyOrderBy', getPropertyOrderBy)
  .provideValue('propertyQuery', fromPropertyQuery)
  .provideClass('propertyTransformer', PropertyTransformer)
  .provideClass('propertyRepository', PropertyRepository)
  .provideClass('propertyController', PropertyController)
  .provideClass('healthController', HealthController)

export default container