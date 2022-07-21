import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import app from '../src/app'
import supertest from 'supertest'

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
  test('GET /v1/businesses not found', async () => {
    const res = await supertest(app)
      .get('/v1/businesses').send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [],
      meta: {
        totalCount: 0
      }
    })
  })
})
