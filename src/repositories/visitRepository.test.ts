import { createInjector } from 'typed-inject'
import pool from '../postgres'
import type { Pool } from 'pg'
import VisitRepository from '../repositories/VisitRepository'

describe('VisitRepository', () => {
  test('find', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: [{
            id: 1,
            job_id: 1,
            invoice_id: null,
            completed: false,
            begins: '2021-11-11T22:55:57.405524',
            ends: null,
            anytime: true,
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

    const repository = container.injectClass(VisitRepository)

    const [totalCount, result] = await repository.find('abc', [{}, {}], undefined, 1)
    expect(totalCount).toEqual(1)
    expect(result).toEqual([{
      id: 1,
      job_id: 1,
      invoice_id: null,
      completed: false,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      anytime: true,
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
          result: []
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

    const repository = container.injectClass(VisitRepository)

    const [totalCount, result] = await repository.find('abc', [{}, {}], undefined, 1)
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
            job_id: 1,
            invoice_id: null,
            completed: false,
            begins: '2021-11-11T22:55:57.405524',
            ends: null,
            anytime: true,
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

    const repository = container.injectClass(VisitRepository)

    const business = await repository.get('abc', 1, 1)
    expect(business).toEqual({
      id: 1,
      job_id: 1,
      invoice_id: null,
      completed: false,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      anytime: true,
      created: '2021-11-11T22:55:57.405524'
    })
  })

  test('create property', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      // TX Begin
      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: {}
        }] // TX property
      }).mockResolvedValueOnce({
        rows: [{
          result: {
            id: 1,
            job_id: 1,
            invoice_id: null,
            completed: false,
            begins: '2021-11-11T22:55:57.405524',
            ends: null,
            anytime: true,
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

    const repository = container.injectClass(VisitRepository)

    const client = await repository.create('abc', {
      job_id: 1,
      invoice_id: null,
      begins: '2021-11-11T22:55:57.000Z',
      ends: null,
      anytime: true
    }, 1)

    expect(client).toEqual({
      id: 1,
      job_id: 1,
      invoice_id: null,
      completed: false,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      anytime: true,
      created: '2021-11-11T22:55:57.405524'
    })
  })
})
