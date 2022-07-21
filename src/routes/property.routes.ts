import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import openApi from '../openapi'
import PropertyController from '../controllers/property.controllers'

function PropertyRouter (authorize: Function, propertyController: PropertyController) {
  const router = Router()

  return router.post(
    '/businesses/:businessId/properties',
    jwtAuthz(['write']),
    authorize('admin'),
    openApi,
    propertyController.create.bind(propertyController)
  ).get(
    '/businesses/:businessId/properties',
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    propertyController.getList.bind(propertyController)
  ).get(
    '/businesses/:businessId/properties',
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    propertyController.getList.bind(propertyController)
  ).get(
    '/businesses/:businessId/properties/:Id',
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    propertyController.getOne.bind(propertyController)
  ).put(
    '/businesses/:businessId/properties/:Id',
    jwtAuthz(['write']),
    authorize('admin', 'worker'),
    openApi,
    propertyController.update.bind(propertyController)
  )
}
PropertyRouter.inject = ['authorization', 'propertyController'] as const

export default PropertyRouter
