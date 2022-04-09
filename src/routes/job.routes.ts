import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
import openApi from '../openapi'
import JobController from '../controllers/job.controllers'

function JobRouter (jobController: JobController) {
  const router = Router()

  return router.post(
    '/',
    checkJwt,
    // jwtAuthz(['create:property', 'read:property']),
    openApi,
    jobController.create.bind(jobController)
  ).get(
    '/',
    checkJwt,
    // jwtAuthz(['read:job']),
    openApi,
    jobController.getList.bind(jobController)
  )
}
JobRouter.inject = ['jobController'] as const

export default JobRouter
