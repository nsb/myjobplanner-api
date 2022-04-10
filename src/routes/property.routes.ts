import { Router } from 'express'
import checkJwt from '../jwt'
import openApi from '../openapi'
import PropertyController from '../controllers/property.controllers'

function PropertyRouter (authorize: Function, propertyController: PropertyController) {
  const router = Router()

  return router.post(
    '/businesses/:businessId/properties',
    checkJwt,
    // jwtAuthz(['create:property', 'read:property']),
    authorize('admin'),
    openApi,
    propertyController.create.bind(propertyController)
  ).get(
    '/businesses/:businessId/properties',
    checkJwt,
    // jwtAuthz(['read:property']),
    authorize('admin', 'worker'),
    openApi,
    propertyController.getList.bind(propertyController)
  )
}
PropertyRouter.inject = ['authorization', 'propertyController'] as const

export default PropertyRouter
