import { createInjector } from 'typed-inject'
import pool from '../postgres'
import type { Pool } from 'pg'
import PropertyRepository from '../repositories/PropertyRepository'

describe('PropertyRepository', () => {
  test('find', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: {
            id: 1,
            client_id: 1,
            description: 'my property',
            address1: 'My address1',
            address2: null,
            city: 'Copenhagen',
            postal_code: '2450',
            country: 'Denmark',
            created: '2021-11-11T22:55:57.405524'
          }
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

    const repository = container.injectClass(PropertyRepository)

    const { totalCount, result } = await repository.find('abc', {})
    expect(totalCount).toEqual(1)
    expect(result).toEqual([{
      id: 1,
      client_id: 1,
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'Denmark',
      created: '2021-11-11T22:55:57.405524'
    }])
  })

  test('find not found', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      (pool as any).query.mockResolvedValueOnce({
        rows: []
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

    const repository = container.injectClass(PropertyRepository)

    const { totalCount, result } = await repository.find('abc')
    expect(totalCount).toEqual(0)
    expect(result).toEqual([])
  })

  test('get', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: {
            id: 1,
            client_id: 1,
            description: 'my property',
            address1: 'My address1',
            address2: null,
            city: 'Copenhagen',
            postal_code: '2450',
            country: 'Denmark',
            created: '2021-11-11T22:55:57.405524'
          }
        }]
      })

      return pool
    }
    poolDecorator.inject = ['pool'] as const

    const container = createInjector()
      .provideValue('pool', pool)
      .provideFactory('pool', poolDecorator)

    const repository = container.injectClass(PropertyRepository)

    const business = await repository.get('abc', 1)
    expect(business).toEqual({
      id: 1,
      client_id: 1,
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'Denmark',
      created: '2021-11-11T22:55:57.405524'
    })
  })

  test('create business', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      // TX Begin
      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: {}
        }] // TX validate
      }).mockResolvedValueOnce({
        rows: [{
          result: {}
        }] // TX property
      }).mockResolvedValueOnce({
        rows: [{
          result: {
            id: 1,
            client_id: 1,
            description: 'my property',
            address1: 'My address1',
            address2: null,
            city: 'Copenhagen',
            postal_code: '2450',
            country: 'Denmark',
            created: '2021-11-11T22:55:57.405524'
          }
        }] // TX Commit
      }).mockResolvedValueOnce({
        rows: [{
          result: {}
        }]
      })

      return pool
    }
    poolDecorator.inject = ['pool'] as const

    const container = createInjector()
      .provideValue('pool', pool)
      .provideFactory('pool', poolDecorator)

    const repository = container.injectClass(PropertyRepository)

    const client = await repository.create('abc', {
      id: 1,
      client_id: 1,
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'Denmark'
    }, 1)

    expect(client).toEqual({
      id: 1,
      client_id: 1,
      description: 'my property',
      address1: 'My address1',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'Denmark',
      created: '2021-11-11T22:55:57.405524'
    })
  })
})
