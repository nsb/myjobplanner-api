import { createInjector } from 'typed-inject'
import * as s from 'zapatos/schema'
import pool from '../postgres'
import type { Pool } from 'pg'
import JobRepository from '../repositories/JobRepository'

describe('JobRepository', () => {
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
            property_id: 1,
            recurrences: null,
            begins: '2021-11-11T22:55:57.405524',
            ends: null,
            start_time: null,
            finish_time: null,
            anytime: true,
            title: 'my job title',
            description: 'my job description',
            closed: false,
            invoice: 'monthly',
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

    const repository = container.injectClass(JobRepository)

    const { totalCount, result } = await repository.find('abc', {})
    expect(totalCount).toEqual(1)
    expect(result).toEqual([{
      id: 1,
      client_id: 1,
      property_id: 1,
      recurrences: null,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      start_time: null,
      finish_time: null,
      anytime: true,
      title: 'my job title',
      description: 'my job description',
      closed: false,
      invoice: 'monthly',
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

    const repository = container.injectClass(JobRepository)

    const { totalCount, result } = await repository.find('abc')
    expect(totalCount).toEqual(0)
    expect(result).toEqual([])
  })

  test('get', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis()

      const mockedResult: s.jobs.Selectable = {
        id: 1,
        client_id: 1,
        property_id: 1,
        recurrences: null,
        begins: new Date('2021-11-11T22:55:57.405524'),
        ends: null,
        start_time: null,
        finish_time: null,
        anytime: true,
        title: 'my job title',
        description: 'my job description',
        closed: false,
        invoice: 'monthly',
        created: new Date('2021-11-11T22:55:57.405524')
      };

      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: mockedResult
        }]
      })

      return pool
    }
    poolDecorator.inject = ['pool'] as const

    const container = createInjector()
      .provideValue('pool', pool)
      .provideFactory('pool', poolDecorator)

    const repository = container.injectClass(JobRepository)

    const job = await repository.get('abc', 1, 1)
    const expected: s.jobs.Selectable = {
      id: 1,
      client_id: 1,
      property_id: 1,
      recurrences: null,
      begins: new Date('2021-11-11T22:55:57.405524'),
      ends: null,
      start_time: null,
      finish_time: null,
      anytime: true,
      title: 'my job title',
      description: 'my job description',
      closed: false,
      invoice: 'monthly',
      created: new Date('2021-11-11T22:55:57.405524')
    }
    expect(job).toEqual(expected)
  })

  test('create job', async () => {
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
        }] // TX validate
      }).mockResolvedValueOnce({
        rows: [{
          result: {}
        }] // TX job
      }).mockResolvedValueOnce({
        rows: [{
          result: {
            id: 1,
            client_id: 1,
            property_id: 1,
            recurrences: null,
            begins: new Date('2021-11-11T22:55:57.405524'),
            ends: null,
            start_time: null,
            finish_time: null,
            anytime: true,
            title: 'my job title',
            description: 'my job description',
            closed: false,
            invoice: 'monthly',
            created: new Date('2021-11-11T22:55:57.405524')
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

    const repository = container.injectClass(JobRepository)

    const job = await repository.create('abc', {
      id: 1,
      client_id: 1,
      property_id: 1,
      recurrences: null,
      begins: new Date('2021-11-11T22:55:57.405524'),
      ends: null,
      start_time: null,
      finish_time: null,
      anytime: true,
      title: 'my job title',
      description: 'my job description',
      closed: false,
      invoice: 'monthly'
    }, 1)

    const expected: s.jobs.Selectable = {
      id: 1,
      client_id: 1,
      property_id: 1,
      recurrences: null,
      begins: new Date('2021-11-11T22:55:57.405524'),
      ends: null,
      start_time: null,
      finish_time: null,
      anytime: true,
      title: 'my job title',
      description: 'my job description',
      closed: false,
      invoice: 'monthly',
      created: new Date('2021-11-11T22:55:57.405524')
    }

    expect(job).toEqual(expected)
  })
})
