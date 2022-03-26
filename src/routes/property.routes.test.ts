import express from 'express'
import { createInjector } from 'typed-inject'
import request from 'supertest'
import type { Request, Response, NextFunction } from 'express'
import type { Options } from 'express-jwt'
import type * as s from 'zapatos/schema';
import { IPropertyRepository } from '../repositories/PropertyRepository'
import PropertyController, { PropertyTransformer } from '../controllers/property.controllers'
import PropertyRouter from './property.routes'

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


describe("PropertyController", () => {
    test('GET /v1/properties', async () => {

        const mockedResult = {
            totalCount: 1,
            result: [{
                "id": 1,
                "client_id": 1,
                "description": "my property",
                "address1": "My address1",
                "address2": null,
                "city": "Copenhagen",
                "postal_code": "2450",
                "country": "Denmark",
                "created": "2021-11-11T22:55:57.405524",
            }]
        }

        const MockRepository = jest.fn<IPropertyRepository, []>(() => ({
            find: jest.fn().mockResolvedValue(mockedResult),
            get: jest.fn(),
            create: jest.fn().mockResolvedValueOnce({})
        }))

        const container = createInjector()
            .provideClass('propertyRepository', MockRepository)
            .provideClass('propertyTransformer', PropertyTransformer)
            .provideClass('propertyController', PropertyController)

        const app = express()
        app.use(express.json())
        app.use('/v1/properties', container.injectFunction(PropertyRouter))

        const res = await request(app)
            .get('/v1/properties').send()
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            data: [{
                "id": 1,
                "clientId": 1,
                "description": "my property",
                "address1": "My address1",
                "address2": null,
                "city": "Copenhagen",
                "postalCode": "2450",
                "country": "Denmark"
            }],
            meta: {
                totalCount: 1
            }
        })
    })

    test('GET /v1/properties not found', async () => {

        const mockedQueryResult = { totalCount: 0, result: [] }

        const MockRepository = jest.fn<IPropertyRepository, []>(() => ({
            find: jest.fn().mockResolvedValue(mockedQueryResult),
            get: jest.fn(),
            create: jest.fn().mockResolvedValue({})
        }))

        const container = createInjector()
            .provideClass('propertyRepository', MockRepository)
            .provideClass('propertyTransformer', PropertyTransformer)
            .provideClass('propertyController', PropertyController)

        const app = express()
        app.use(express.json())
        app.use('/v1/properties', container.injectFunction(PropertyRouter))

        const res = await request(app)
            .get('/v1/properties').send()
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            data: [],
            meta: {
                totalCount: 0
            }
        })
    })

    test('POST /v1/properties', async () => {

        const mockedQueryResult = {
            "id": 1,
            "client_id": 1,
            "description": "my property",
            "address1": "My address1",
            "address2": null,
            "city": "Copenhagen",
            "postal_code": "2450",
            "country": "Denmark",
            "created": "2021-11-11T22:55:57.405524",
        }

        const MockRepository = jest.fn<IPropertyRepository, []>(() => ({
            find: jest.fn(),
            get: jest.fn(),
            create: jest.fn().mockResolvedValue(mockedQueryResult)
        }))

        const container = createInjector()
            .provideClass('propertyRepository', MockRepository)
            .provideClass('propertyTransformer', PropertyTransformer)
            .provideClass('propertyController', PropertyController)

        const app = express()
        app.use(express.json())
        app.use('/v1/properties', container.injectFunction(PropertyRouter))

        const res = await request(app)
            .post('/v1/properties')
            .send({
                "clientId": 1,
                "description": "my property",
                "address1": "My address1",
                "address2": null,
                "city": "Copenhagen",
                "postalCode": "2450",
                "country": "Denmark",
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            "id": 1,
            "clientId": 1,
            "description": "my property",
            "address1": "My address1",
            "address2": null,
            "city": "Copenhagen",
            "postalCode": "2450",
            "country": "Denmark"
        })
    })
})