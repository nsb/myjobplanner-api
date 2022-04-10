import { Router } from 'express'
import checkJwt from '../jwt'
import openApi from '../openapi'
import ClientController from '../controllers/client.controllers'

function ClientRouter (authorize: Function, clientController: ClientController) {
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
ClientRouter.inject = ['authorization', 'clientController'] as const

export default ClientRouter
