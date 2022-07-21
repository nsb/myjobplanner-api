import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import VisitController from '../controllers/visit.controllers'
import type { OpenApiRequestHandler } from 'express-openapi-validator/dist/framework/types'

function VisitRouter (
  authorize: Function,
  openApi: OpenApiRequestHandler[],
  visitController: VisitController
) {
  const router = Router()

  return router.post(
    '/businesses/:businessId/visits',
    jwtAuthz(['write']),
    authorize('admin'),
    openApi,
    visitController.create.bind(visitController)
  ).get(
    '/businesses/:businessId/visits',
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    visitController.getList.bind(visitController)
  ).get(
    '/businesses/:businessId/visits/:Id',
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    visitController.getOne.bind(visitController)
  ).put(
    '/businesses/:businessId/visits/:Id',
    jwtAuthz(['write']),
    authorize('admin', 'worker'),
    openApi,
    visitController.update.bind(visitController)
  )
}
VisitRouter.inject = ['authorization', 'openApi', 'visitController'] as const

export default VisitRouter
