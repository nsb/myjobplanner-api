import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import BusinessController from '../controllers/business.controllers'
import type { OpenApiRequestHandler } from 'express-openapi-validator/dist/framework/types'

function BusinessRouter (
  openApi: OpenApiRequestHandler[],
  businessController: BusinessController
) {
  const router = Router()

  return router.post(
    '/businesses',
    jwtAuthz(['write']),
    openApi,
    businessController.create.bind(businessController)
  ).get(
    '/businesses',
    jwtAuthz(['read']),
    openApi,
    businessController.getList.bind(businessController)
  ).get(
    '/businesses/:Id',
    jwtAuthz(['read']),
    openApi,
    businessController.getOne.bind(businessController)
  ).put(
    '/businesses/:Id',
    jwtAuthz(['write']),
    openApi,
    businessController.update.bind(businessController)
  )
}
BusinessRouter.inject = ['openApi', 'businessController'] as const

export default BusinessRouter
