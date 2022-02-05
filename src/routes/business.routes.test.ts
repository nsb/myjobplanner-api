import express from 'express'
import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import type * as s from 'zapatos/schema';
import { IBusinessRepository } from '../repositories/BusinessRepository'
import BusinessController from '../controllers/business.controllers'
import BusinessRouter from './business.routes'

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


describe("BusinessController", () => {
    test('GET /v1/businesses', async () => {

        const mockedQueryResult: s.businesses.JSONSelectable[] = [{
            "id": 1,
            "name": "Idealrent",
            "timezone": "Europe/Copenhagen",
            "country_code": "da",
            "vat_number": null,
            "created": "2021-11-11T22:55:57.405524Z"
        }]

        const MockRepository = jest.fn<IBusinessRepository, []>(() => ({
            find: jest.fn().mockResolvedValue(mockedQueryResult),
            create: jest.fn().mockResolvedValueOnce({})
        }))

        const container = createInjector()
            .provideClass('businessRepository', MockRepository)
            .provideClass('businessController', BusinessController)

        const app = express()
        app.use(express.json())
        app.use('/v1/businesses', container.injectFunction(BusinessRouter))

        const res = await request(app)
            .get('/v1/businesses').send()
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([{
            "id": 1,
            "name": "Idealrent",
            "timezone": "Europe/Copenhagen",
            "countryCode": "da"
        }])
    })

    test('GET /v1/businesses not found', async () => {

        const mockedQueryResult: s.businesses.JSONSelectable[] = []

        const MockRepository = jest.fn<IBusinessRepository, []>(() => ({
            find: jest.fn().mockResolvedValue(mockedQueryResult),
            create: jest.fn().mockResolvedValue({})
        }))

        const container = createInjector()
            .provideClass('businessRepository', MockRepository)
            .provideClass('businessController', BusinessController)

        const app = express()
        app.use(express.json())
        app.use('/v1/businesses', container.injectFunction(BusinessRouter))

        const res = await request(app)
            .get('/v1/businesses').send()
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual([])
    })

    test('POST /v1/businesses', async () => {

        const mockedQueryResult: s.businesses.JSONSelectable = {
            "id": 1,
            "name": "Idealrent",
            "timezone": "Europe/Copenhagen",
            "country_code": "da",
            "vat_number": null,
            "created": "2021-11-11T22:55:57.405524Z"
        }

        const MockRepository = jest.fn<IBusinessRepository, []>(() => ({
            find: jest.fn(),
            create: jest.fn().mockResolvedValue(mockedQueryResult)
        }))

        const container = createInjector()
            .provideClass('businessRepository', MockRepository)
            .provideClass('businessController', BusinessController)

        const app = express()
        app.use(express.json())
        app.use('/v1/businesses', container.injectFunction(BusinessRouter))

        const res = await request(app)
            .post('/v1/businesses')
            .send({
                name: 'Idealrent',
                timezone: 'Europe/Copenhagen',
                countryCode: 'da'
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            "id": 1,
            "name": "Idealrent",
            "timezone": "Europe/Copenhagen",
            "countryCode": "da"
        })
    })
})