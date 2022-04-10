import { Router } from 'express'
import checkJwt from '../jwt'
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
    checkJwt,
    // jwtAuthz(['create:property', 'read:property']),
    authorize('admin'),
    openApi,
    jobController.create.bind(jobController)
  ).get(
    '/businesses/:businessId/jobs',
    checkJwt,
    // jwtAuthz(['read:job']),
    authorize('admin', 'worker'),
    openApi,
    jobController.getList.bind(jobController)
  )
}
JobRouter.inject = ['authorization', 'openApi', 'jobController'] as const

export default JobRouter
