import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import JobController from '../controllers/job.controllers'
import type { OpenApiRequestHandler } from 'express-openapi-validator/dist/framework/types'

function JobRouter (
  authorize: Function,
  openApi: OpenApiRequestHandler[],
  jobController: JobController
) {
  const router = Router()

  return router.post(
    '/businesses/:businessId/jobs',
    jwtAuthz(['write']),
    authorize('admin'),
    openApi,
    jobController.create.bind(jobController)
  ).get(
    '/businesses/:businessId/jobs',
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    jobController.getList.bind(jobController)
  ).get(
    '/businesses/:businessId/jobs/:Id',
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    jobController.getOne.bind(jobController)
  ).put(
    '/businesses/:businessId/jobs/:Id',
    jwtAuthz(['write']),
    authorize('admin'),
    openApi,
    jobController.update.bind(jobController)
  )
}
JobRouter.inject = ['authorization', 'openApi', 'jobController'] as const

export default JobRouter
