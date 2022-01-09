import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import pool from '../postgres'
import type { Pool } from 'pg'
import BusinessRepository from '../repositories/BusinessRepository'
import BusinessController from './business.controllers'
import BusinessRouter from '../routes/business.routes'
import app from '../app'

function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  req.user = {
    iss: "",
    sub: "abc",
    aud: [],
    iat: 1,
    exp: 1,
    azp: "",
    scope: ""
  }
  next()
}
jest.mock('express-jwt', () => { return (options: Options) => { return jwtMiddleware } })
jest.mock('express-jwt-authz', () => { return (options: Options) => { return jwtMiddleware } })

afterAll((done) => {
  done()
})

test('GET /v1/businesses', async () => {

  function poolDecorator(pool: Pool) {
    (pool as any).connect = jest.fn().mockReturnThis();
    (pool as any).release = jest.fn().mockReturnThis();
    (pool as any).query = jest.fn().mockReturnThis();

    (pool as any).query.mockResolvedValueOnce({
      rows: [{
        result: {
          "id": 1,
          "name": "Niels Sandholt Busch",
          "email": "niels.busch@gmail.com",
          "created": "2021-11-11T22:55:57.405524",
          "picture": null,
          "user_id": "abc",
          "businesses": [
            {
              "id": 1,
              "name": "Idealrent",
              "email": "niels.busch@gmail.com",
              "created": "2021-11-11T22:55:57.405524",
              "timezone": "Europe/Copenhagen",
              "vat_number": null,
              "country_code": "da"
            }
          ]
        }
      }]
    });

    return pool
  }
  poolDecorator.inject = ['pool'] as const

  const container = createInjector()
    .provideValue('pool', pool)
    .provideFactory('pool', poolDecorator)
    .provideClass('businessRepository', BusinessRepository)
    .provideClass('businessController', BusinessController)

  app.use('/v1/businesses', container.injectFunction(BusinessRouter))

  const res = await request(app)
    .get('/v1/businesses').send()
  expect(res.statusCode).toEqual(200)
  expect(res.body).toEqual([{
    "id": 1,
    "name": "Idealrent",
    "timezone": "Europe/Copenhagen",
    "countryCode": "da",
    // "vat_number": null,
    // "email": "niels.busch@gmail.com",
    // "created": "2021-10-12T06:48:57.616Z"
  }])
})

test('GET /v1/businesses not found', async () => {

  function poolDecorator(pool: Pool) {
    (pool as any).connect = jest.fn().mockReturnThis();
    (pool as any).release = jest.fn().mockReturnThis();
    (pool as any).query = jest.fn().mockReturnThis();

    (pool as any).query.mockResolvedValueOnce({
      rows: [{
        result: {
          "id": 1,
          "name": "Niels Sandholt Busch",
          "email": "niels.busch@gmail.com",
          "created": "2021-11-11T22:55:57.405524",
          "picture": null,
          "user_id": "abc",
          "businesses": [
            null
          ]
        }
      }]
    });

    return pool
  }
  poolDecorator.inject = ['pool'] as const

  const container = createInjector()
    .provideValue('pool', pool)
    .provideFactory('pool', poolDecorator)
    .provideClass('businessRepository', BusinessRepository)
    .provideClass('businessController', BusinessController)

  app.use('/v1/businesses', container.injectFunction(BusinessRouter))

  const res = await request(app)
    .get('/v1/businesses').send()
  expect(res.statusCode).toEqual(200)
  expect(res.body).toEqual([])
})
