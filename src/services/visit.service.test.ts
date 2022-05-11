import { createInjector } from 'typed-inject'
import pool from '../postgres'
import type { Pool } from 'pg'
import VisitService from '../services/visit.service'
import type { IVisitRepository } from '../repositories/VisitRepository'
import type { ILineItemRepository } from '../repositories/LineItemRepository'
import type { ILineItemOverrideRepository } from '../repositories/LineItemOverrideRepository'

describe('VisitService', () => {
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
      job_id: 1,
      invoice_id: null,
      completed: false,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      anytime: true,
      lineitems: [{
        id: 1,
        visit_id: 1,
        name: 'my lineitem',
        description: null,
        unit_cost: 100,
        quantity: 1
      }],
      created: '2021-11-11T22:55:57.405524'
    }]]

    const MockVisitRepository = jest.fn<IVisitRepository, []>(() => ({
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

    const MockLineItemOverrideRepository = jest.fn<ILineItemOverrideRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideValue('pool', pool)
      .provideClass('visitRepository', MockVisitRepository)
      .provideClass('lineItemRepository', MockLineItemRepository)
      .provideClass('lineItemOverrideRepository', MockLineItemOverrideRepository)

    const service = container.injectClass(VisitService)

    const [totalCount, result] = await service.find(
      'abc',
      [{}, {}],
      { limit: 20, offset: 0, orderBy: 'created', orderDirection: 'ASC' },
      1
    )
    expect(totalCount).toEqual(1)
    expect(result).toEqual(
      [
        [
          {
            id: 1,
            job_id: 1,
            invoice_id: null,
            completed: false,
            begins: '2021-11-11T22:55:57.405524',
            ends: null,
            anytime: true,
            created: '2021-11-11T22:55:57.405524'
          },
          [{
            id: 1,
            visit_id: 1,
            name: 'my lineitem',
            description: null,
            unit_cost: 100,
            quantity: 1
          }]
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

    const MockVisitRepository = jest.fn<IVisitRepository, []>(() => ({
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

    const MockLineItemOverrideRepository = jest.fn<ILineItemOverrideRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideValue('pool', pool)
      .provideClass('visitRepository', MockVisitRepository)
      .provideClass('lineItemRepository', MockLineItemRepository)
      .provideClass('lineItemOverrideRepository', MockLineItemOverrideRepository)

    const service = container.injectClass(VisitService)

    const [totalCount, result] = await service.find(
      'abc',
      [{}, {}],
      { limit: 20, offset: 0, orderBy: 'created', orderDirection: 'ASC' },
      1
    )
    expect(totalCount).toEqual(0)
    expect(result).toEqual([])
  })

  test('get', async () => {
    function poolDecorator (pool: Pool) {
      (pool as any).connect = jest.fn().mockReturnThis();
      (pool as any).release = jest.fn().mockReturnThis();
      (pool as any).query = jest.fn().mockReturnThis()
      return pool
    }
    poolDecorator.inject = ['pool'] as const

    const mockedResult = {
      id: 1,
      job_id: 1,
      invoice_id: null,
      completed: false,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      anytime: true,
      created: '2021-11-11T22:55:57.405524'
    }

    const MockVisitRepository = jest.fn<IVisitRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn().mockResolvedValue(mockedResult),
      create: jest.fn(),
      update: jest.fn()
    }))

    const MockLineItemRepository = jest.fn<ILineItemRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const MockLineItemOverrideRepository = jest.fn<ILineItemOverrideRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideValue('pool', pool)
      .provideClass('visitRepository', MockVisitRepository)
      .provideClass('lineItemRepository', MockLineItemRepository)
      .provideClass('lineItemOverrideRepository', MockLineItemOverrideRepository)

    const service = container.injectClass(VisitService)

    const result = await service.get('abc', 1, 1)
    expect(result).toEqual(
      [
        {
          id: 1,
          job_id: 1,
          invoice_id: null,
          completed: false,
          begins: '2021-11-11T22:55:57.405524',
          ends: null,
          anytime: true,
          created: '2021-11-11T22:55:57.405524'
        }, undefined
      ]
    )
  })

  test('create visit', async () => {
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

    const visitMockedResult = {
      id: 1,
      job_id: 1,
      invoice_id: null,
      completed: false,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      anytime: true,
      created: '2021-11-11T22:55:57.405524'
    }

    const lineItemMockedResult = {
      id: 1,
      name: 'my override',
      description: null,
      quantity: 0,
      unit_cost: 100
    }

    const overrideMockedResult = {
      id: 1,
      lineitem_id: 1,
      visit_id: 1,
      quantity: 1
    }

    const MockVisitRepository = jest.fn<IVisitRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce(visitMockedResult),
      update: jest.fn()
    }))

    const MockLineItemRepository = jest.fn<ILineItemRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce(lineItemMockedResult),
      update: jest.fn()
    }))

    const MockLineItemOverrideRepository = jest.fn<ILineItemOverrideRepository, []>(() => ({
      find: jest.fn(),
      get: jest.fn(),
      create: jest.fn().mockResolvedValueOnce(overrideMockedResult),
      update: jest.fn()
    }))

    const container = createInjector()
      .provideValue('pool', pool)
      .provideFactory('pool', poolDecorator)
      .provideClass('visitRepository', MockVisitRepository)
      .provideClass('lineItemRepository', MockLineItemRepository)
      .provideClass('lineItemOverrideRepository', MockLineItemOverrideRepository)

    const service = container.injectClass(VisitService)

    const visit = await service.create('abc', [{
      id: 1,
      job_id: 1,
      invoice_id: null,
      completed: false,
      begins: '2021-11-11T22:55:57Z',
      ends: null,
      anytime: true
    }, [{
      job_id: 1,
      name: 'my override',
      quantity: 1,
      unit_cost: 100
    }]], 1)

    const expected = [{
      id: 1,
      job_id: 1,
      invoice_id: null,
      completed: false,
      begins: '2021-11-11T22:55:57.405524',
      ends: null,
      anytime: true,
      created: '2021-11-11T22:55:57.405524'
    }, [{
      id: 1,
      visit_id: 1,
      name: 'my override',
      description: null,
      quantity: 1,
      unit_cost: 100
    }]]

    expect(visit).toEqual(expected)
  })
})
