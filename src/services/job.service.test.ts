import { createInjector } from 'typed-inject'
import pool from '../postgres'
import type { Pool } from 'pg'
import JobService from '../services/job.service'
import type { IJobRepository } from '../repositories/JobRepository'
import type { ILineItemRepository } from '../repositories/LineItemRepository'

describe('JobService', () => {
  test('find', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis()
      return pool
    }
    poolDecorator.inject = ['pool'] as const

    const mockedResult = [1, [{
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
      created: '2021-11-11T22:55:57.405524',
      lineitems: []
    }]]

    const MockJobRepository = jest.fn<IJobRepository, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const MockLineItemRepository = jest.fn<ILineItemRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideValue('pool', pool)
      .provideClass('jobRepository', MockJobRepository)
      .provideClass('lineItemRepository', MockLineItemRepository)

    const service = container.injectClass(JobService)

    const [totalCount, result] = await service.find(
      'abc',
      {},
      { limit: 20, offset: 0, orderBy: 'created', orderDirection: 'ASC' },
      1
    )
    expect(totalCount).toEqual(1)
    expect(result).toEqual(
      [
        [
          {
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
            created: '2021-11-11T22:55:57.405524',
            lineitems: []
          },
          []
        ]
      ])
  })

  test('find not found', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis()
      return pool
    }
    poolDecorator.inject = ['pool'] as const

    const mockedResult = [0, []]

    const MockJobRepository = jest.fn<IJobRepository, []>(() => ({
      find: jest.fn().mockResolvedValue(mockedResult),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce({}),
      update: jest.fn()
    }))

    const MockLineItemRepository = jest.fn<ILineItemRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideValue('pool', pool)
      .provideClass('jobRepository', MockJobRepository)
      .provideClass('lineItemRepository', MockLineItemRepository)

    const service = container.injectClass(JobService)

    const [totalCount, result] = await service.find(
      'abc',
      {},
      { limit: 20, offset: 0, orderBy: 'created', orderDirection: 'ASC' },
      1
    )
    expect(totalCount).toEqual(0)
    expect(result).toEqual([])
  })

  //   test('get', async () => {
  //     function poolDecorator (pool: Pool) {
  //       (pool as any).connect = jest.fn().mockReturnThis();
  //       (pool as any).release = jest.fn().mockReturnThis();
  //       (pool as any).query = jest.fn().mockReturnThis()

  //       const mockedResult: s.jobs.Selectable = {
  //         id: 1,
  //         client_id: 1,
  //         property_id: 1,
  //         recurrences: null,
  //         begins: new Date('2021-11-11T22:55:57.405524'),
  //         ends: null,
  //         start_time: null,
  //         finish_time: null,
  //         anytime: true,
  //         title: 'my job title',
  //         description: 'my job description',
  //         closed: false,
  //         invoice: 'monthly',
  //         created: new Date('2021-11-11T22:55:57.405524')
  //       };

  //       (pool as any).query.mockResolvedValueOnce({
  //         rows: [{
  //           result: mockedResult
  //         }]
  //       })

  //       return pool
  //     }
  //     poolDecorator.inject = ['pool'] as const

  //     const container = createInjector()
  //       .provideValue('pool', pool)
  //       .provideFactory('pool', poolDecorator)

  //     const repository = container.injectClass(JobRepository)

  //     const job = await repository.get('abc', 1, 1)
  //     const expected: s.jobs.Selectable = {
  //       id: 1,
  //       client_id: 1,
  //       property_id: 1,
  //       recurrences: null,
  //       begins: new Date('2021-11-11T22:55:57.405524'),
  //       ends: null,
  //       start_time: null,
  //       finish_time: null,
  //       anytime: true,
  //       title: 'my job title',
  //       description: 'my job description',
  //       closed: false,
  //       invoice: 'monthly',
  //       created: new Date('2021-11-11T22:55:57.405524')
  //     }
  //     expect(job).toEqual(expected)
  //   })

  test('create job', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis();

      // TX Begin
      (pool as any).query.mockResolvedValueOnce({
        rows: [{
          result: {}
        }] // TX Commit
      }).mockResolvedValueOnce({
        rows: [{
          result: {}
        }]
      })

      return pool
    }
    poolDecorator.inject = ['pool'] as const

    const mockedResult = {
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

    const MockJobRepository = jest.fn<IJobRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce(mockedResult),
      update: jest.fn()
    }))

    const MockLineItemRepository = jest.fn<ILineItemRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideValue('pool', pool)
      .provideFactory('pool', poolDecorator)
      .provideClass('jobRepository', MockJobRepository)
      .provideClass('lineItemRepository', MockLineItemRepository)

    const service = container.injectClass(JobService)

    const job = await service.create('abc', [{
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
    }, []], 1)

    const expected = [{
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
    }, []]

    expect(job).toEqual(expected)
  })
})
