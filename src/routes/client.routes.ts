import { Router } from 'express'
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
    // jwtAuthz(['create:client', 'read:client']),
    openApi,
    clientController.create.bind(clientController)
  ).get(
    '/businesses/:businessId/clients',
    checkJwt,
    authorize('admin', 'worker'),
    // jwtAuthz(['read:client']),
    openApi,
    clientController.getList.bind(clientController)
  )
}
ClientRouter.inject = ['authorization', 'openApi', 'clientController'] as const

export default ClientRouter
