import { createInjector } from 'typed-inject'
import pool from '../postgres'
import type { Pool } from 'pg'
import BusinessRepository from '../repositories/BusinessRepository'

describe("BusinessRepository", () => {
    test('find', async () => {

        function poolDecorator(pool: Pool) {
            (pool as any).connect = jest.fn().mockReturnThis();
            (pool as any).release = jest.fn().mockReturnThis();
            (pool as any).query = jest.fn().mockReturnThis();

            (pool as any).query.mockResolvedValueOnce({
                rows: [{
                    result: [
                        {
                            "id": 1,
                            "name": "Idealrent",
                            "created": "2021-11-11T22:55:57.405524",
                            "timezone": "Europe/Copenhagen",
                            "vat_number": null,
                            "country_code": "da"
                        }
                    ]
                }]
            }).mockResolvedValueOnce({
                rows: [{
                    result: 1
                }]
            })

            return pool
        }
        poolDecorator.inject = ['pool'] as const

        const container = createInjector()
            .provideValue('pool', pool)
            .provideFactory('pool', poolDecorator)

        const repository = container.injectClass(BusinessRepository)

        const { totalCount, result } = await repository.find('abc')
        expect(totalCount).toEqual(1)
        expect(result).toEqual([{
            "id": 1,
            "name": "Idealrent",
            "timezone": "Europe/Copenhagen",
            "country_code": "da",
            "vat_number": null,
            "created": "2021-11-11T22:55:57.405524"
        }])
    })

    test('find not found', async () => {

        function poolDecorator(pool: Pool) {
            (pool as any).connect = jest.fn().mockReturnThis();
            (pool as any).release = jest.fn().mockReturnThis();
            (pool as any).query = jest.fn().mockReturnThis();

            (pool as any).query.mockResolvedValueOnce({
                rows: [{
                    result: [
                        null
                    ]
                }]
            }).mockResolvedValueOnce({
                rows: [{
                    result: 0
                }]
            })

            return pool
        }
        poolDecorator.inject = ['pool'] as const

        const container = createInjector()
            .provideValue('pool', pool)
            .provideFactory('pool', poolDecorator)

        const repository = container.injectClass(BusinessRepository)

        const { totalCount, result } = await repository.find('abc')
        expect(totalCount).toEqual(0)
        expect(result).toEqual([])
    })

    test('getById', async () => {

        function poolDecorator(pool: Pool) {
            (pool as any).connect = jest.fn().mockReturnThis();
            (pool as any).release = jest.fn().mockReturnThis();
            (pool as any).query = jest.fn().mockReturnThis();

            (pool as any).query.mockResolvedValueOnce({
                rows: [{
                    result: {
                        "id": 1,
                        "name": "Idealrent",
                        "created": "2021-11-11T22:55:57.405524",
                        "timezone": "Europe/Copenhagen",
                        "vat_number": null,
                        "country_code": "da"
                    }
                }]
            });

            return pool
        }
        poolDecorator.inject = ['pool'] as const

        const container = createInjector()
            .provideValue('pool', pool)
            .provideFactory('pool', poolDecorator)

        const repository = container.injectClass(BusinessRepository)

        const business = await repository.getById('abc', 1)
        expect(business).toEqual({
            "id": 1,
            "name": "Idealrent",
            "timezone": "Europe/Copenhagen",
            "country_code": "da",
            "vat_number": null,
            "created": "2021-11-11T22:55:57.405524"
        })
    })

    test('create business', async () => {

        function poolDecorator(pool: Pool) {
            (pool as any).connect = jest.fn().mockReturnThis();
            (pool as any).release = jest.fn().mockReturnThis();
            (pool as any).query = jest.fn().mockReturnThis();

            // TX Begin
            (pool as any).query.mockResolvedValueOnce({
                rows: [{
                    result: {}
                }] // TX business
            }).mockResolvedValueOnce({
                rows: [{
                    result: {
                        "id": 1,
                        "name": "Idealrent",
                        "created": "2021-11-11T22:55:57.405524",
                        "timezone": "Europe/Copenhagen",
                        "vat_number": null,
                        "country_code": "da"
                    }
                }] // TX employee
            }).mockResolvedValueOnce({
                rows: [{
                    result: [1]
                }] // TX Commit
            }).mockResolvedValueOnce({
                rows: [{
                    result: {}
                }]
            });

            return pool
        }
        poolDecorator.inject = ['pool'] as const

        const container = createInjector()
            .provideValue('pool', pool)
            .provideFactory('pool', poolDecorator)

        const repository = container.injectClass(BusinessRepository)

        const business = await repository.create('abc', {
            name: "Idealrent",
            timezone: "Europe/Copenhagen",
            country_code: "da"
        })

        expect(business).toEqual({
            "id": 1,
            "name": "Idealrent",
            "timezone": "Europe/Copenhagen",
            "country_code": "da",
            "vat_number": null,
            "created": "2021-11-11T22:55:57.405524"
        })
    })
})