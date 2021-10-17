import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
import BusinessController from '../controllers/business.controllers'

function BusinessRouter(businessController: BusinessController) {
  const router = Router()
  router.get('/', checkJwt, jwtAuthz(['read:business']), businessController.getAllBusinesses.bind(businessController))
  return router
}
BusinessRouter.inject = ['businessController'] as const

export default BusinessRouter