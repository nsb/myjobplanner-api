import { Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import { inject, injectable } from 'inversify'
import BusinessController from '../controllers/business.controllers'
import openApi from '../openapi'
import { IRouter } from './router.interface'

@injectable()
class BusinessRouter implements IRouter {
  private router = Router()
  constructor (
    @inject('businessController') private controller: BusinessController
  ) {}

  createRouter () {
    return this.router.post(
      '/businesses',
      jwtAuthz(['write']),
      openApi,
      this.controller.create.bind(this.controller)
    ).get(
      '/businesses',
      jwtAuthz(['read']),
      openApi,
      this.controller.getList.bind(this.controller)
    ).get(
      '/businesses/:Id',
      jwtAuthz(['read']),
      openApi,
      this.controller.getOne.bind(this.controller)
    ).put(
      '/businesses/:Id',
      jwtAuthz(['write']),
      openApi,
      this.controller.update.bind(this.controller)
    )
  }
}

export default BusinessRouter
