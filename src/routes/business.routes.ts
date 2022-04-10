import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import BusinessController from '../controllers/business.controllers'
import type { OpenApiRequestHandler } from 'express-openapi-validator/dist/framework/types'
import jwt from 'express-jwt'

function BusinessRouter (
  checkJwt: jwt.RequestHandler,
  openApi: OpenApiRequestHandler[],
  businessController: BusinessController
) {
  const router = Router()

  return router.post(
    '/businesses',
    checkJwt,
    jwtAuthz(['create:business', 'read:business']),
    openApi,
    businessController.create.bind(businessController)
  ).get(
    '/businesses',
    checkJwt,
    jwtAuthz(['read:business']),
    openApi,
    businessController.getList.bind(businessController)
  ).get(
    '/businesses/:Id',
    checkJwt,
    jwtAuthz(['read:business']),
    openApi,
    businessController.getOne.bind(businessController)
  )
}
BusinessRouter.inject = ['checkJwt', 'openApi', 'businessController'] as const

export default BusinessRouter
