import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import ClientController from '../controllers/client.controllers'
import { OpenApiRequestHandler } from 'express-openapi-validator/dist/framework/types'

function ClientRouter (
  authorize: Function,
  openApi: OpenApiRequestHandler[],
  clientController: ClientController
) {
  const router = Router()

  return router.post(
    '/businesses/:businessId/clients',
    authorize('admin'),
    jwtAuthz(['write']),
    openApi,
    clientController.create.bind(clientController)
  ).get(
    '/businesses/:businessId/clients',
    authorize('admin', 'worker'),
    jwtAuthz(['read']),
    openApi,
    clientController.getList.bind(clientController)
  ).get(
    '/businesses/:businessId/clients/:Id',
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    clientController.getOne.bind(clientController)
  ).put(
    '/businesses/:businessId/clients/:Id',
    jwtAuthz(['write']),
    authorize('admin', 'worker'),
    openApi,
    clientController.update.bind(clientController)
  )
}
ClientRouter.inject = ['authorization', 'openApi', 'clientController'] as const

export default ClientRouter
