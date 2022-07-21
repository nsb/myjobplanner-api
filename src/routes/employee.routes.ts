import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import EmployeeController from '../controllers/employee.controllers'
import { OpenApiRequestHandler } from 'express-openapi-validator/dist/framework/types'

function EmployeeRouter (
  authorize: Function,
  openApi: OpenApiRequestHandler[],
  employeeController: EmployeeController
) {
  const router = Router()

  return router.post(
    '/businesses/:businessId/employees',
    authorize('admin'),
    jwtAuthz(['write']),
    openApi,
    employeeController.create.bind(employeeController)
  ).get(
    '/businesses/:businessId/employees',
    authorize('admin', 'worker'),
    jwtAuthz(['read']),
    openApi,
    employeeController.getList.bind(employeeController)
  ).get(
    '/businesses/:businessId/employees/:Id',
    jwtAuthz(['read']),
    authorize('admin', 'worker'),
    openApi,
    employeeController.getOne.bind(employeeController)
  ).put(
    '/businesses/:businessId/employees/:Id',
    jwtAuthz(['write']),
    authorize('admin', 'worker'),
    openApi,
    employeeController.update.bind(employeeController)
  )
}
EmployeeRouter.inject = ['authorization', 'openApi', 'employeeController'] as const

export default EmployeeRouter
