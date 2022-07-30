import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import app from '../src/app'
import pool from '../src/postgres'
import request from 'supertest'

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
  beforeAll(done => {
    done()
  })

  afterAll(done => {
    pool.end().then(done)
  })

  test('GET /v1/businesses not found', async () => {
    const res = await request(app)
      .get('/v1/businesses')
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({
      data: [],
      meta: {
        totalCount: 0
      }
    })
  })

  test('POST /v1/businesses', async () => {
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
})
