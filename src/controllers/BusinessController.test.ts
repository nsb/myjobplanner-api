import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import pool, { IDbPool, Result } from '../postgres'
import BusinessRouter, { BusinessController } from './BusinessController'

export class FakeDb implements IDbPool {
  async query(sql: string): Promise<Result> {
    return Promise.resolve({ rows: [] })
  }
}

function noOpMiddleware(req: Request, res: Response, next: NextFunction) { next() }
jest.mock('express-jwt', () => { return (options: Options) => { return noOpMiddleware } })
jest.mock('express-jwt-authz', () => { return (options: Options) => { return noOpMiddleware } })

const injector = createInjector()
  .provideValue('pool', pool)
  .provideClass('dbPool', FakeDb)
  .provideClass('businessController', BusinessController)

test('should return a list of businesses', async () => {
  const app = injector.injectFunction(BusinessRouter)
  const res = await request(app)
    .get('/businesses').send()
  expect(res.statusCode).toEqual(200)
});
