import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
import openApi from '../openapi'
import ClientController from '../controllers/client.controllers'

function ClientRouter (clientController: ClientController) {
  const router = Router()

  return router.post(
    '/',
    checkJwt,
    // jwtAuthz(['create:client', 'read:client']),
    openApi,
    clientController.create.bind(clientController)
  ).get(
    '/',
    checkJwt,
    // jwtAuthz(['read:client']),
    openApi,
    clientController.getList.bind(clientController)
  )
}
ClientRouter.inject = ['clientController'] as const

export default ClientRouter
