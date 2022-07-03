import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
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
    checkJwt,
    jwtAuthz(['write']),
    authorize('admin'),
    openApi,
    visitController.create.bind(visitController)
  ).get(
    '/businesses/:businessId/visits',
    checkJwt,
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    visitController.getList.bind(visitController)
  ).put(
    '/businesses/:businessId/visits/:Id',
    checkJwt,
    jwtAuthz(['write']),
    authorize('admin', 'worker'),
    openApi,
    visitController.update.bind(visitController)
  )
}
VisitRouter.inject = ['authorization', 'openApi', 'visitController'] as const

export default VisitRouter
