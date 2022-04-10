import { Router } from 'express'
import checkJwt from '../jwt'
import openApi from '../openapi'
import JobController from '../controllers/job.controllers'

function JobRouter (authorize: Function, jobController: JobController) {
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
JobRouter.inject = ['authorization', 'jobController'] as const

export default JobRouter
