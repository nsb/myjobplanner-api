import express from 'express'
import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import { IJobRepository } from '../repositories/JobRepository'
import JobController from '../controllers/job.controllers'
import JobRouter from './job.routes'

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
  test('GET /v1/jobs', async () => {
    const mockedResult = {
      totalCount: 1,
      result: [{
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
      }]
    }

    const MockRepository = jest.fn<IJobRepository, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('jobRepository', MockRepository)
      .provideClass('jobController', JobController)

    const app = express()
    app.use(express.json())
    app.use('/v1/jobs', container.injectFunction(JobRouter))

    const res = await request(app)
      .get('/v1/jobs').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [{
        id: 1,
        clientId: 1,
        propertyId: 1,
        recurrences: null,
        begins: '2021-11-11T22:55:57.405524',
        ends: null,
        startTime: null,
        finishTime: null,
        anytime: true,
        title: null,
        description: null,
        closed: false,
        invoice: 'never'
      }],
      meta: {
        totalCount: 1
      }
    })
  })

  test('GET /v1/jobs not found', async () => {
    const mockedQueryResult = { totalCount: 0, result: [] }

    const MockRepository = jest.fn<IJobRepository, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedQueryResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('jobRepository', MockRepository)
      .provideClass('jobController', JobController)

    const app = express()
    app.use(express.json())
    app.use('/v1/jobs', container.injectFunction(JobRouter))

    const res = await request(app)
      .get('/v1/jobs').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [],
      meta: {
        totalCount: 0
      }
    })
  })

  test('POST /v1/jobs', async () => {
    const mockedQueryResult = {
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
    }

    const MockRepository = jest.fn<IJobRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue(mockedQueryResult),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('jobRepository', MockRepository)
      .provideClass('jobController', JobController)

    const app = express()
    app.use(express.json())
    app.use('/v1/jobs', container.injectFunction(JobRouter))

    const res = await request(app)
      .post('/v1/jobs')
      .send({
        clientId: 1,
        propertyId: 1,
        recurrences: null,
        begins: '2021-11-11T22:55:57.405524',
        ends: null,
        startTime: null,
        finishTime: null,
        anytime: true,
        title: null,
        description: null,
        closed: false,
        invoice: 'never'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      id: 1,
      clientId: 1,
      propertyId: 1,
      recurrences: null,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      startTime: null,
      finishTime: null,
      anytime: true,
      title: null,
      description: null,
      closed: false,
      invoice: 'never'
    })
  })
})
