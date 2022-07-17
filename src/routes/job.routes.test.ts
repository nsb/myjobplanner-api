import express from 'express'
import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import type { IJobService } from '../services/job.service'
import JobController from '../controllers/job.controllers'
import JobRouter from './job.routes'
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

describe('JobController', () => {
  test('GET /v1/businesses/:businessId/jobs', async () => {
    const mockedResult = [
      1,
      [
        [{
          id: 1,
          client_id: 1,
          property_id: 1,
          recurrences: null,
          begins: '2021-11-11T22:55:57.405524',
          ends: null,
          start_time: null,
          finish_time: null,
          anytime: true,
          title: null,
          description: null,
          closed: false,
          invoice: 'never',
          created: '2021-11-11T22:55:57.405524'
        }, []]
      ]
    ]

    const MockService = jest.fn<IJobService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('jobService', MockService)
      .provideClass('jobController', JobController)
      .provideValue('authorization', authorizationMiddleware)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(JobRouter))

    const res = await request(app)
      .get('/v1/businesses/1/jobs').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [{
        id: '/businesses/1/jobs/1',
        client: '/businesses/1/clients/1',
        property: '/businesses/1/properties/1',
        recurrences: null,
        begins: '2021-11-11T22:55:57.405524',
        ends: null,
        startTime: null,
        finishTime: null,
        anytime: true,
        title: null,
        description: null,
        closed: false,
        invoice: 'never',
        lineItems: []
      }],
      meta: {
        totalCount: 1
      }
    })
  })

  test('GET /v1/businesses/:businessId/jobs not found', async () => {
    const mockedQueryResult = [0, []]

    const MockService = jest.fn<IJobService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedQueryResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('jobService', MockService)
      .provideClass('jobController', JobController)
      .provideValue('authorization', authorizationMiddleware)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(JobRouter))

    const res = await request(app)
      .get('/v1/businesses/1/jobs').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [],
      meta: {
        totalCount: 0
      }
    })
  })

  test('POST /v1/businesses/:businessId/jobs', async () => {
    const mockedQueryResult = [{
      id: 1,
      client_id: 1,
      property_id: 1,
      recurrences: null,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      start_time: null,
      finish_time: null,
      anytime: true,
      title: null,
      description: null,
      closed: false,
      invoice: 'never',
      created: '2021-11-11T22:55:57.405524'
    }, []]

    const MockService = jest.fn<IJobService, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue(mockedQueryResult),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('jobService', MockService)
      .provideClass('jobController', JobController)
      .provideValue('authorization', authorizationMiddleware)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(JobRouter))

    const res = await request(app)
      .post('/v1/businesses/1/jobs')
      .send({
        client: '/businesses/1/clients/1',
        property: '/businesses/1/properties/1',
        recurrences: null,
        begins: '2021-11-11T22:55:57.405524',
        ends: null,
        startTime: null,
        finishTime: null,
        anytime: true,
        title: null,
        description: null,
        closed: false,
        invoice: 'never',
        lineItems: []
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toEqual({
      id: '/businesses/1/jobs/1',
      client: '/businesses/1/clients/1',
      property: '/businesses/1/properties/1',
      recurrences: null,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      startTime: null,
      finishTime: null,
      anytime: true,
      title: null,
      description: null,
      closed: false,
      invoice: 'never',
      lineItems: []
    })
  })
})
