import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
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
    checkJwt,
    authorize('admin'),
    jwtAuthz(['write']),
    openApi,
    clientController.create.bind(clientController)
  ).get(
    '/businesses/:businessId/clients',
    checkJwt,
    authorize('admin', 'worker'),
    jwtAuthz(['read']),
    openApi,
    clientController.getList.bind(clientController)
  ).get(
    '/businesses/:businessId/clients',
    checkJwt,
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    clientController.getList.bind(clientController)
  ).put(
    '/businesses/:businessId/clients/:Id',
    checkJwt,
    jwtAuthz(['write']),
    authorize('admin', 'worker'),
    openApi,
    clientController.update.bind(clientController)
  )
}
ClientRouter.inject = ['authorization', 'openApi', 'clientController'] as const

export default ClientRouter
