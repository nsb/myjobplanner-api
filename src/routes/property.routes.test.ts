import express from 'express'
import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import type { IPropertyService } from '../services/property.service'
import PropertyController from '../controllers/property.controllers'
import PropertyRouter from './property.routes'

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

describe('PropertyController', () => {
  test('GET /v1/businesses/:businessId/properties', async () => {
    const mockedResult = [
      1,
      [{
        id: 1,
        client_id: 1,
        description: 'my property',
        address1: 'My address1',
        address2: null,
        city: 'Copenhagen',
        postal_code: '2450',
        country: 'Denmark',
        created: '2021-11-11T22:55:57.405524'
      }]
    ]

    const MockService = jest.fn<IPropertyService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('propertyService', MockService)
      .provideClass('propertyController', PropertyController)
      .provideValue('authorization', authorizationMiddleware)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(PropertyRouter))

    const res = await request(app)
      .get('/v1/businesses/1/properties').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [{
        id: '/businesses/1/properties/1',
        client: '/businesses/1/clients/1',
        description: 'my property',
        address1: 'My address1',
        address2: null,
        city: 'Copenhagen',
        postalCode: '2450',
        country: 'Denmark'
      }],
      meta: {
        totalCount: 1
      }
    })
  })

  test('GET /v1/businesses/:businessId/properties/:Id', async () => {
    const mockedResult = {
      id: 1,
      client_id: 1,
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'Denmark',
      created: '2021-11-11T22:55:57.405524'
    }

    const MockService = jest.fn<IPropertyService, []>(() => ({
      find: jest.fn(),
      get: jest.fn().mockResolvedValue(mockedResult),
      create: jest.fn(),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('propertyService', MockService)
      .provideClass('propertyController', PropertyController)
      .provideValue('authorization', authorizationMiddleware)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(PropertyRouter))

    const res = await request(app)
      .get('/v1/businesses/1/properties/1').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      id: '/businesses/1/properties/1',
      client: '/businesses/1/clients/1',
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postalCode: '2450',
      country: 'Denmark'
    })
  })

  test('GET /v1/businesses/:businessId/properties not found', async () => {
    const mockedQueryResult = [0, []]

    const MockService = jest.fn<IPropertyService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedQueryResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('propertyService', MockService)
      .provideClass('propertyController', PropertyController)
      .provideValue('authorization', authorizationMiddleware)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(PropertyRouter))

    const res = await request(app)
      .get('/v1/businesses/1/properties').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [],
      meta: {
        totalCount: 0
      }
    })
  })

  test('POST /v1/businesses/:businessId/properties', async () => {
    const mockedQueryResult = {
      id: 1,
      client_id: 1,
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'Denmark',
      created: '2021-11-11T22:55:57.405524'
    }

    const MockService = jest.fn<IPropertyService, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue(mockedQueryResult),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('propertyService', MockService)
      .provideClass('propertyController', PropertyController)
      .provideValue('authorization', authorizationMiddleware)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(PropertyRouter))

    const res = await request(app)
      .post('/v1/businesses/1/properties')
      .send({
        client: '/businesses/1/clients/1',
        description: 'my property',
        address1: 'My address1',
        address2: null,
        city: 'Copenhagen',
        postalCode: '2450',
        country: 'Denmark'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toEqual({
      id: '/businesses/1/properties/1',
      client: '/businesses/1/clients/1',
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postalCode: '2450',
      country: 'Denmark'
    })
  })

  test('PUT /v1/businesses/:businessId/properties/:Id', async () => {
    const mockedQueryResult = {
      id: 1,
      client_id: 1,
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'Denmark',
      created: '2021-11-11T22:55:57.405524'
    }

    const MockService = jest.fn<IPropertyService, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue(mockedQueryResult)
    }))

    const container = createInjector()
      .provideClass('propertyService', MockService)
      .provideClass('propertyController', PropertyController)
      .provideValue('authorization', authorizationMiddleware)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(PropertyRouter))

    const res = await request(app)
      .put('/v1/businesses/1/properties/1')
      .send({
        client: '/businesses/1/clients/1',
        description: 'my property',
        address1: 'My address1',
        address2: null,
        city: 'Copenhagen',
        postalCode: '2450',
        country: 'Denmark'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      id: '/businesses/1/properties/1',
      client: '/businesses/1/clients/1',
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postalCode: '2450',
      country: 'Denmark'
    })
  })
})
