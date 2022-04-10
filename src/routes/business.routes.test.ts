import express from 'express'
import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import type * as s from 'zapatos/schema'
import { IBusinessRepository } from '../repositories/BusinessRepository'
import BusinessController from '../controllers/business.controllers'
import BusinessRouter from './business.routes'
import openApi from '../openapi'

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

describe('BusinessController', () => {
  test('GET /v1/businesses', async () => {
    const mockedResult = {
      totalCount: 1,
      result: [{
        id: 1,
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        country_code: 'da',
        vat_number: null,
        vat: 25,
        visit_reminders: false,
        created: '2021-11-11T22:55:57.405524Z'
      }]
    }

    const MockRepository = jest.fn<IBusinessRepository, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('businessRepository', MockRepository)
      .provideClass('businessController', BusinessController)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(BusinessRouter))

    const res = await request(app)
      .get('/v1/businesses').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [{
        id: 1,
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
    const mockedResult = {
      totalCount: 2,
      result: [{
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
    }

    const MockRepository = jest.fn<IBusinessRepository, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('businessRepository', MockRepository)
      .provideClass('businessController', BusinessController)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(BusinessRouter))

    const res = await request(app)
      .get('/v1/businesses').send({ orderBy: 'id', orderDirection: 'ASC' })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [{
        id: 1,
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        countryCode: 'da'
      }, {
        id: 2,
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
    const mockedQueryResult = { totalCount: 0, result: [] }

    const MockRepository = jest.fn<IBusinessRepository, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedQueryResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('businessRepository', MockRepository)
      .provideClass('businessController', BusinessController)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(BusinessRouter))

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

    const MockRepository = jest.fn<IBusinessRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn().mockResolvedValue(mockedResult),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('businessRepository', MockRepository)
      .provideClass('businessController', BusinessController)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(BusinessRouter))

    const res = await request(app)
      .get('/v1/businesses/1').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      id: 1,
      name: 'Idealrent',
      timezone: 'Europe/Copenhagen',
      countryCode: 'da'
    })
  })

  test('GET /v1/businesses/1 not found', async () => {
    const MockRepository = jest.fn<IBusinessRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn().mockResolvedValue(undefined),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('businessRepository', MockRepository)
      .provideClass('businessController', BusinessController)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(BusinessRouter))

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

    const MockRepository = jest.fn<IBusinessRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue(mockedQueryResult),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('businessRepository', MockRepository)
      .provideClass('businessController', BusinessController)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(BusinessRouter))

    const res = await request(app)
      .post('/v1/businesses')
      .send({
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        countryCode: 'da'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      id: 1,
      name: 'Idealrent',
      timezone: 'Europe/Copenhagen',
      countryCode: 'da'
    })
  })
})
