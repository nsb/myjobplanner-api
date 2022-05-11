import { Router } from 'express'
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
    // jwtAuthz(['create:visit', 'read:visit']),
    authorize('admin'),
    openApi,
    visitController.create.bind(visitController)
  ).get(
    '/businesses/:businessId/visits',
    checkJwt,
    // jwtAuthz(['read:visit']),
    authorize('admin', 'worker'),
    openApi,
    visitController.getList.bind(visitController)
  ).put(
    '/businesses/:businessId/visits/:Id',
    checkJwt,
    // jwtAuthz(['read:visit']),
    authorize('admin', 'worker'),
    openApi,
    visitController.update.bind(visitController)
  )
}
VisitRouter.inject = ['authorization', 'openApi', 'visitController'] as const

export default VisitRouter
