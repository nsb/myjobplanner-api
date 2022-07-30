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

  test('/v1/businesses', async () => {
    await request(app)
      .get('/v1/businesses')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          data: [],
          meta: {
            totalCount: 0
          }
        })
      })

    await request(app)
      .post('/v1/businesses')
      .send({
        name: 'Idealrent',
        timezone: 'Europe/Copenhagen',
        countryCode: 'da'
      })
      .expect(201)
      .then(res => {
        expect(res.body).toEqual({
          id: '/businesses/1',
          name: 'Idealrent',
          timezone: 'Europe/Copenhagen',
          countryCode: 'da'
        })
      })

    await request(app)
      .get('/v1/businesses')
      .send()
      .expect(200)
      .then(res => {
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

    await request(app)
      .put('/v1/businesses/1')
      .send({
        name: 'My other name',
        timezone: 'Europe/Copenhagen',
        countryCode: 'da'
      })
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: '/businesses/1',
          name: 'My other name',
          timezone: 'Europe/Copenhagen',
          countryCode: 'da'
        })
      })

    await request(app)
      .get('/v1/businesses/1')
      .send()
      .expect(200)
      .then(res => {
        expect(res.body).toEqual({
          id: '/businesses/1',
          name: 'My other name',
          timezone: 'Europe/Copenhagen',
          countryCode: 'da'
        })
      })
  })
})
