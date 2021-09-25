import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import server from './app'

function noOpMiddleware(req: Request, res: Response, next: NextFunction) { next() }
jest.mock('express-jwt', () => { return (options: Options) => { return noOpMiddleware } })
jest.mock('express-jwt-authz', () => { return (options: Options) => { return noOpMiddleware } })

afterAll((done) => {
  server.close()
  done()
})

test('should return a list of businesses', async () => {
  const res = await request(server)
    .get('/businesses').send()

  expect(res.statusCode).toEqual(200)
});
