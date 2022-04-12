import express, { Request, Response, NextFunction } from 'express'
import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Options } from 'express-jwt'
import type * as s from 'zapatos/schema'
import type { IClientService } from '../services/client.service'
import ClientController from '../controllers/client.controllers'
import ClientRouter from './client.routes'
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

describe('ClientController', () => {
  test('GET /v1/businesses/1/clients', async () => {
    const mockedResult = [
      1,
      [{
        id: 1,
        business_id: 1,
        first_name: 'Ole',
        last_name: 'Hansen',
        business_name: null,
        is_business: false,
        address1: 'my address',
        address2: null,
        city: 'Copenhagen',
        postal_code: '2450',
        country: 'DK',
        email: 'olehansen@example.com',
        phone: '12341324',
        is_active: true,
        visit_reminders: false,
        external_id: null,
        imported_via: null,
        created: '2021-11-11T22:55:57.405524'
      }]
    ]

    const MockService = jest.fn<IClientService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('clientService', MockService)
      .provideClass('clientController', ClientController)
      .provideValue('authorization', authorizationMiddleware)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(ClientRouter))

    const res = await request(app)
      .get('/v1/businesses/1/clients').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [{
        id: 1,
        businessId: 1,
        firstName: 'Ole',
        lastName: 'Hansen'
      }],
      meta: {
        totalCount: 1
      }
    })
  })

  test('GET /v1/businesses/1/clients not found', async () => {
    const mockedQueryResult = [0, []]

    const MockService = jest.fn<IClientService, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedQueryResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('clientService', MockService)
      .provideClass('clientController', ClientController)
      .provideValue('authorization', authorizationMiddleware)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(ClientRouter))

    const res = await request(app)
      .get('/v1/businesses/1/clients').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [],
      meta: {
        totalCount: 0
      }
    })
  })

  test('POST /v1/businesses/1/clients', async () => {
    const mockedQueryResult: s.clients.JSONSelectable = {
      id: 1,
      business_id: 1,
      first_name: 'Ole',
      last_name: 'Hansen',
      business_name: null,
      is_business: false,
      address1: 'my address',
      address2: null,
      address_use_property: true,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'DK',
      email: 'olehansen@example.com',
      phone: '12341324',
      is_active: true,
      visit_reminders: false,
      external_id: null,
      imported_via: null,
      imported_from: null,
      created: '2021-11-11T22:55:57.405524Z'
    }

    const MockService = jest.fn<IClientService, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValue(mockedQueryResult),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideClass('clientService', MockService)
      .provideClass('clientController', ClientController)
      .provideValue('authorization', authorizationMiddleware)
      .provideValue('openApi', openApi)

    const app = express()
    app.use(express.json())
    app.use('/v1', container.injectFunction(ClientRouter))

    const res = await request(app)
      .post('/v1/businesses/1/clients')
      .send({
        businessId: 1,
        firstName: 'Ole',
        lastName: 'Hansen'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      id: 1,
      businessId: 1,
      firstName: 'Ole',
      lastName: 'Hansen'
    })
  })
})
