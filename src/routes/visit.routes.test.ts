import express from 'express'
import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import type { IVisitService } from '../services/visit.service'
import VisitController from '../controllers/visit.controllers'
import VisitRouter from './visit.routes'
import openApi from '../openapi'

function authorizationMiddleware (...permittedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    next()
  }
}

function jwtMiddleware (req: Request, res: Response, next: NextFunction) {
  req.user = {
    iss: '',
    sub: 'abc',
    aud: [],
    iat: 1,
    exp: 1,
    azp: '',
    scope: ''
  }
  next()
}
jest.mock('express-jwt', () => { return (options: Options) => { return jwtMiddleware } })
jest.mock('express-jwt-authz', () => { return (options: Options) => { return jwtMiddleware } })

describe('VisitController', () => {
  test('GET /v1/businesses/:businessId/visits', async () => {
    const mockedResult = [
      1,
      [
        [{
          id: 1,
          job_id: 1,
          invoice_id: null,
          completed: false,
          begins: '2021-11-11T22:55:57.405524',
          ends: null,
          anytime: true,
          created: '2021-11-11T22:55:57.405524'
        }, [{
          id: 1,
          lineitem_id: 1,
          visit_id: 1,
          description: null,
          name: 'Cleaning',
          unit_cost: 100,
          quantity: 1
        }]]
      ]
    ]

    const MockService = jest.fn<IVisitService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('visitService', MockService)
      .provideClass('visitController', VisitController)
      .provideValue('authorization', authorizationMiddleware)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(VisitRouter))

    const res = await request(app)
      .get('/v1/businesses/1/visits').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [{
        id: 1,
        jobId: 1,
        invoiceId: null,
        completed: false,
        begins: '2021-11-11T22:55:57.405524',
        ends: null,
        anytime: true,
        lineItems: [{
          id: 1,
          name: 'Cleaning',
          description: null,
          unitCost: 100,
          quantity: 1
        }]
      }],
      meta: {
        totalCount: 1
      }
    })
  })

  test('GET /v1/businesses/:businessId/visits not found', async () => {
    const mockedQueryResult = [0, []]

    const MockService = jest.fn<IVisitService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedQueryResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('visitService', MockService)
      .provideClass('visitController', VisitController)
      .provideValue('authorization', authorizationMiddleware)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(VisitRouter))

    const res = await request(app)
      .get('/v1/businesses/1/visits').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [],
      meta: {
        totalCount: 0
      }
    })
  })

  test('POST /v1/businesses/:businessId/visits', async () => {
    const mockedQueryResult = [{
      id: 1,
      job_id: 1,
      invoice_id: null,
      completed: false,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      anytime: true,
      created: '2021-11-11T22:55:57.405524'
    }, []]

    const MockService = jest.fn<IVisitService, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue(mockedQueryResult),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('visitService', MockService)
      .provideClass('visitController', VisitController)
      .provideValue('authorization', authorizationMiddleware)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(VisitRouter))

    const res = await request(app)
      .post('/v1/businesses/1/visits')
      .send({
        jobId: 1,
        invoiceId: null,
        completed: false,
        begins: '2021-11-11T22:55:57.405524',
        ends: null,
        anytime: true,
        lineItems: []
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      id: 1,
      jobId: 1,
      invoiceId: null,
      completed: false,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      anytime: true,
      lineItems: []
    })
  })
})
