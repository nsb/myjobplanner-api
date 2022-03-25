import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
import openApi from '../openapi'
import BusinessController from '../controllers/business.controllers'

function BusinessRouter(businessController: BusinessController) {
  const router = Router()

  return router.post(
    '/',
    checkJwt,
    jwtAuthz(['create:business', 'read:business']),
    openApi,
    businessController.createBusinesses.bind(businessController)
  ).get(
    '/',
    checkJwt,
    jwtAuthz(['read:business']),
    openApi,
    businessController.getBusinesses.bind(businessController)
  ).get(
    '/:businessId',
    checkJwt,
    jwtAuthz(['read:business']),
    openApi,
    businessController.getBusiness.bind(businessController)
  )
}
BusinessRouter.inject = ['businessController'] as const

export default BusinessRouter