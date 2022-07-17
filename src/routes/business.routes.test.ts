import express from 'express'
import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import type * as s from 'zapatos/schema'
import type { IBusinessService } from '../services/business.service'
import BusinessController from '../controllers/business.controllers'
import BusinessRouter from './business.routes'
import openApi from '../openapi'
import jwt from 'express-jwt'

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
jest.mock('express-jwt-authz', () => { return (options: Options) => { return jwtMiddleware } })

describe('BusinessController', () => {
  const container = createInjector()
    .provideValue('openApi', openApi)
    .provideValue('checkJwt', jwtMiddleware as jwt.RequestHandler)

  test('GET /v1/businesses', async () => {
    const mockedResult = [
      1,
      [{
        id: 1,
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        country_code: 'da',
        vat_number: null,
        vat: 25,
        visit_reminders: false,
        created: '2021-11-11T22:55:57.405524Z'
      }]
    ]

    const MockService = jest.fn<IBusinessService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const app = express()
    app.use(express.json())
    app.use('/v1', container
      .provideClass('businessService', MockService)
      .provideClass('businessController', BusinessController)
      .injectFunction(BusinessRouter)
    )

    const res = await request(app)
      .get('/v1/businesses').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [{
        id: '/businesses/1',
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        countryCode: 'da'
      }],
      meta: {
        totalCount: 1
      }
    })
  })

  test('GET /v1/businesses?orderBy=id&orderDirection=ASC', async () => {
    const mockedResult = [
      2,
      [{
        id: 1,
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        country_code: 'da',
        vat_number: null,
        vat: 25,
        visit_reminders: false,
        created: '2021-11-11T22:55:57.405524Z'
      }, {
        id: 2,
        name: 'My super company',
        timezone: 'Europe/Copenhagen',
        country_code: 'da',
        vat_number: null,
        vat: 25,
        visit_reminders: false,
        created: '2021-11-11T22:55:57.405524Z'
      }]
    ]

    const MockService = jest.fn<IBusinessService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const app = express()
    app.use(express.json())
    app.use('/v1', container
      .provideClass('businessService', MockService)
      .provideClass('businessController', BusinessController)
      .injectFunction(BusinessRouter))

    const res = await request(app)
      .get('/v1/businesses').send({ orderBy: 'id', orderDirection: 'ASC' })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [{
        id: '/businesses/1',
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        countryCode: 'da'
      }, {
        id: '/businesses/2',
        name: 'My super company',
        timezone: 'Europe/Copenhagen',
        countryCode: 'da'
      }],
      meta: {
        totalCount: 2
      }
    })
  })

  test('GET /v1/businesses not found', async () => {
    const mockedQueryResult = [0, []]

    const MockService = jest.fn<IBusinessService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedQueryResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn()
    }))

    const app = express()
    app.use(express.json())
    app.use('/v1', container
      .provideClass('businessService', MockService)
      .provideClass('businessController', BusinessController)
      .injectFunction(BusinessRouter))

    const res = await request(app)
      .get('/v1/businesses').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [],
      meta: {
        totalCount: 0
      }
    })
  })

  test('GET /v1/businesses/1', async () => {
    const mockedResult = {
      id: 1,
      name: 'Idealrent',
      timezone: 'Europe/Copenhagen',
      country_code: 'da',
      vat_number: null,
      vat: 25,
      visit_reminders: false,
      created: '2021-11-11T22:55:57.405524Z'
    }

    const MockService = jest.fn<IBusinessService, []>(() => ({
      find: jest.fn(),
      get: jest.fn().mockResolvedValue(mockedResult),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const app = express()
    app.use(express.json())
    app.use('/v1', container
      .provideClass('businessService', MockService)
      .provideClass('businessController', BusinessController)
      .injectFunction(BusinessRouter))

    const res = await request(app)
      .get('/v1/businesses/1').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      id: '/businesses/1',
      name: 'Idealrent',
      timezone: 'Europe/Copenhagen',
      countryCode: 'da'
    })
  })

  test('GET /v1/businesses/1 not found', async () => {
    const MockService = jest.fn<IBusinessService, []>(() => ({
      find: jest.fn(),
      get: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const app = express()
    app.use(express.json())
    app.use('/v1', container
      .provideClass('businessService', MockService)
      .provideClass('businessController', BusinessController)
      .injectFunction(BusinessRouter))

    const res = await request(app)
      .get('/v1/businesses/1').send()
    expect(res.statusCode).toEqual(404)
  })

  test('POST /v1/businesses', async () => {
    const mockedQueryResult: s.businesses.JSONSelectable = {
      id: 1,
      name: 'Idealrent',
      timezone: 'Europe/Copenhagen',
      country_code: 'da',
      vat_number: null,
      vat: 25,
      visit_reminders: false,
      created: '2021-11-11T22:55:57.405524Z'
    }

    const MockService = jest.fn<IBusinessService, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue(mockedQueryResult),
      update: jest.fn()
    }))

    const app = express()
    app.use(express.json())
    app.use('/v1', container
      .provideClass('businessService', MockService)
      .provideClass('businessController', BusinessController)
      .injectFunction(BusinessRouter))

    const res = await request(app)
      .post('/v1/businesses')
      .send({
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        countryCode: 'da'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toEqual({
      id: '/businesses/1',
      name: 'Idealrent',
      timezone: 'Europe/Copenhagen',
      countryCode: 'da'
    })
  })

  test('PUT /v1/businesses/1', async () => {
    const mockedQueryResult: s.businesses.JSONSelectable = {
      id: 1,
      name: 'Idealrent',
      timezone: 'Europe/Copenhagen',
      country_code: 'da',
      vat_number: null,
      vat: 25,
      visit_reminders: false,
      created: '2021-11-11T22:55:57.405524Z'
    }

    const MockService = jest.fn<IBusinessService, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue(mockedQueryResult)
    }))

    const app = express()
    app.use(express.json())
    app.use('/v1', container
      .provideClass('businessService', MockService)
      .provideClass('businessController', BusinessController)
      .injectFunction(BusinessRouter))

    const res = await request(app)
      .put('/v1/businesses/1')
      .send({
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        countryCode: 'da'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      id: '/businesses/1',
      name: 'Idealrent',
      timezone: 'Europe/Copenhagen',
      countryCode: 'da'
    })
  })
})
