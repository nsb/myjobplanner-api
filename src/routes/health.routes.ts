import { Router } from 'express'
import HealthController from '../controllers/health.controllers'

function HealthRouter (controller: HealthController) {
  const router = Router()
  router.get('/', controller.getHealth.bind(controller))
  return router
}
HealthRouter.inject = ['healthController'] as const

export default HealthRouter
