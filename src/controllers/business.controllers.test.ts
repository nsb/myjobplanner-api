import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import pool from '../postgres'
import type { Pool } from 'pg'
import BusinessRepository from '../repositories/BusinessRepository'
import BusinessController from './business.controllers'
import BusinessRouter from '../routes/business.routes'
import type { Business } from '../models/business'
import app from '../app'

function noOpMiddleware(req: Request, res: Response, next: NextFunction) { next() }
jest.mock('express-jwt', () => { return (options: Options) => { return noOpMiddleware } })
jest.mock('express-jwt-authz', () => { return (options: Options) => { return noOpMiddleware } })

function poolDecorator(pool: Pool) {
  (pool as any).query = jest.fn();

  (pool as any).query.mockReturnValue({
    rows: [{
      "id": 1,
      "name": "Idealrent",
      "timezone": "Europe/Copenhagen",
      // "country_code": "da",
      // "vat_number": null,
      // "email": "niels.busch@gmail.com",
      // "created": "2021-10-12T06:48:57.616Z"
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

afterAll((done) => {
  done()
})

test('GET /v1/businesses', async () => {
  const res = await request(app)
    .get('/v1/businesses').send()
  expect(res.statusCode).toEqual(200)
  expect(res.body).toEqual([{
    "id": 1,
    "name": "Idealrent",
    "timezone": "Europe/Copenhagen",
    // "country_code": "da",
    // "vat_number": null,
    // "email": "niels.busch@gmail.com",
    // "created": "2021-10-12T06:48:57.616Z"
  }])
})
