import { Router } from 'express'
import checkJwt from '../jwt'
import openApi from '../openapi'
import PropertyController from '../controllers/property.controllers'

function PropertyRouter (propertyController: PropertyController) {
  const router = Router()

  return router.post(
    '/businesses/:businessId/properties',
    checkJwt,
    // jwtAuthz(['create:property', 'read:property']),
    openApi,
    propertyController.create.bind(propertyController)
  ).get(
    '/businesses/:businessId/properties',
    checkJwt,
    // jwtAuthz(['read:property']),
    openApi,
    propertyController.getList.bind(propertyController)
  )
}
PropertyRouter.inject = ['propertyController'] as const

export default PropertyRouter
