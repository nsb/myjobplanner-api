import { createInjector } from 'typed-inject'
import pool from '../postgres'
import type { Pool } from 'pg'
import ClientRepository from '../repositories/ClientRepository'

describe('ClientRepository', () => {
  test('find', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: [{
            id: 1,
            business_id: 1,
            first_name: 'Ole',
            last_name: 'Hansen',
            business_name: null,
            is_business: false,
            address1: 'my address',
            address2: null,
            city: 'Copenhagen',
            postal_code: '2450',
            country: 'DK',
            email: 'olehansen@example.com',
            phone: '12341324',
            is_active: true,
            visit_reminders: false,
            external_id: null,
            imported_via: null,
            created: '2021-11-11T22:55:57.405524'
          }]
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

    const repository = container.injectClass(ClientRepository)

    const [totalCount, result] = await repository.find('abc', { business_id: 1 })
    expect(totalCount).toEqual(1)
    expect(result).toEqual([{
      id: 1,
      business_id: 1,
      first_name: 'Ole',
      last_name: 'Hansen',
      business_name: null,
      is_business: false,
      address1: 'my address',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'DK',
      email: 'olehansen@example.com',
      phone: '12341324',
      is_active: true,
      visit_reminders: false,
      external_id: null,
      imported_via: null,
      created: '2021-11-11T22:55:57.405524'
    }])
  })

  test('find not found', async () => {
    function poolDecorator (pool: Pool) {
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

    const repository = container.injectClass(ClientRepository)

    const [totalCount, result] = await repository.find('abc')
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
            business_id: 1,
            first_name: 'Ole',
            last_name: 'Hansen',
            business_name: null,
            is_business: false,
            address1: 'my address',
            address2: null,
            city: 'Copenhagen',
            postal_code: '2450',
            country: 'DK',
            email: 'olehansen@example.com',
            phone: '12341324',
            is_active: true,
            visit_reminders: false,
            external_id: null,
            imported_via: null,
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

    const repository = container.injectClass(ClientRepository)

    const business = await repository.get('abc', 1, 1)
    expect(business).toEqual({
      id: 1,
      business_id: 1,
      first_name: 'Ole',
      last_name: 'Hansen',
      business_name: null,
      is_business: false,
      address1: 'my address',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'DK',
      email: 'olehansen@example.com',
      phone: '12341324',
      is_active: true,
      visit_reminders: false,
      external_id: null,
      imported_via: null,
      created: '2021-11-11T22:55:57.405524'
    })
  })

  test('create client', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: {
            id: 1,
            business_id: 1,
            first_name: 'Ole',
            last_name: 'Hansen',
            business_name: null,
            is_business: false,
            address1: 'my address',
            address2: null,
            city: 'Copenhagen',
            postal_code: '2450',
            country: 'DK',
            email: 'olehansen@example.com',
            phone: '12341324',
            is_active: true,
            visit_reminders: false,
            external_id: null,
            imported_via: null,
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

    const repository = container.injectClass(ClientRepository)

    const client = await repository.create('abc', {
      id: 1,
      business_id: 1,
      first_name: 'Ole',
      last_name: 'Hansen',
      business_name: null,
      is_business: false,
      address1: 'my address',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'DK',
      email: 'olehansen@example.com',
      phone: '12341324',
      is_active: true,
      visit_reminders: false,
      external_id: null,
      imported_via: null
    }, 1)

    expect(client).toEqual({
      id: 1,
      business_id: 1,
      first_name: 'Ole',
      last_name: 'Hansen',
      business_name: null,
      is_business: false,
      address1: 'my address',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'DK',
      email: 'olehansen@example.com',
      phone: '12341324',
      is_active: true,
      visit_reminders: false,
      external_id: null,
      imported_via: null,
      created: '2021-11-11T22:55:57.405524'
    })
  })

  test('update client', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: {
            id: 1,
            business_id: 1,
            first_name: 'Ole',
            last_name: 'Hansen',
            business_name: null,
            is_business: false,
            address1: 'my address',
            address2: null,
            city: 'Copenhagen',
            postal_code: '2450',
            country: 'DK',
            email: 'olehansen@example.com',
            phone: '12341324',
            is_active: true,
            visit_reminders: false,
            external_id: null,
            imported_via: null,
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

    const repository = container.injectClass(ClientRepository)

    const client = await repository.update('abc', 1, {
      id: 1,
      business_id: 1,
      first_name: 'Ole',
      last_name: 'Hansen',
      business_name: null,
      is_business: false,
      address1: 'my address',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'DK',
      email: 'olehansen@example.com',
      phone: '12341324',
      is_active: true,
      visit_reminders: false,
      external_id: null,
      imported_via: null
    }, 1)

    expect(client).toEqual({
      id: 1,
      business_id: 1,
      first_name: 'Ole',
      last_name: 'Hansen',
      business_name: null,
      is_business: false,
      address1: 'my address',
      address2: null,
      city: 'Copenhagen',
      postal_code: '2450',
      country: 'DK',
      email: 'olehansen@example.com',
      phone: '12341324',
      is_active: true,
      visit_reminders: false,
      external_id: null,
      imported_via: null,
      created: '2021-11-11T22:55:57.405524'
    })
  })
})
