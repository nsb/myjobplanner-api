import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import { ILineItemOverrideRepository } from '../repositories/LineItemOverrideRepository'
import { ILineItemRepository } from '../repositories/LineItemRepository'
import { IVisitRepository } from '../repositories/VisitRepository'
import { RepositoryOptions } from '../types'
import { IService } from './base.service'

type VisitInsertable = [s.visits.Insertable, s.lineitems.Insertable[]]
type VisitUpdatable = [s.visits.Updatable, (s.lineitems.Updatable | s.lineitems.Insertable)[]]
// eslint-disable-next-line camelcase
type VisitSelectable = [s.visits.JSONSelectable, Array<s.lineitem_overrides.JSONSelectable & s.lineitems.JSONSelectable>]
type VisitWhereable = [s.visits.Whereable, s.clients.Whereable]

export interface IVisitService extends IService<
  VisitInsertable,
  VisitUpdatable,
  VisitSelectable,
  VisitWhereable,
  s.visits.Table
> {}

class VisitService implements IVisitService {
  public static inject = [
    'pool',
    'visitRepository',
    'lineItemRepository',
    'lineItemOverrideRepository'
  ] as const

  constructor (
      private pool: Pool,
      private repository: IVisitRepository,
      private lineItemRepository: ILineItemRepository,
      private lineItemOverrideRepository: ILineItemOverrideRepository
  ) {}

  async create (userId: string, [visit, overrides]: VisitInsertable, businessId?: number) {
    return db.readCommitted(this.pool, async txnClient => {
      const createdVisit = await this.repository.create(
        userId,
        visit,
        businessId,
        txnClient
      )
      const createdOverrides = await Promise.all(overrides.map(async (override) => {
        let lineItem
        // The lineitem has an Id, so we get can get it and create an override
        if (override.id) {
          lineItem = await this.lineItemRepository.get(userId, override.id as number, businessId)
        }

        // The lineitem does not have an Id, so create a
        // lineitem with quantity 0 before creating the override
        if (!lineItem) {
          lineItem = await this.lineItemRepository.create(
            userId, {
              ...override,
              job_id: createdVisit.job_id,
              quantity: 0
            },
            businessId,
            txnClient
          )
        }

        // Create the override if it has a different
        // quantity than the lineitem
        if (lineItem.quantity !== override.quantity) {
          await this.lineItemOverrideRepository.create(
            userId, {
              lineitem_id: lineItem.id,
              visit_id: createdVisit.id,
              quantity: override.quantity
            },
            businessId, txnClient
          )
        }

        return {
          id: lineItem.id,
          visit_id: createdVisit.id,
          quantity: override.quantity,
          name: lineItem.name,
          description: lineItem.description,
          unit_cost: lineItem.unit_cost
        }
      }))
      return [createdVisit, createdOverrides] as VisitSelectable
    })
  }

  async update (userId: string, id: number, [visit, overrides]: VisitUpdatable, businessId?: number) {
    return db.readCommitted(this.pool, async txnClient => {
      const updatedVisit = await this.repository.update(
        userId,
        id,
        { ...visit, id },
        businessId,
        txnClient
      )
      const updatedOverrides = await Promise.all(overrides.map(async (override) => {
        let lineItem
        // The lineitem has an Id, so we get can get it and create an override
        if (override.id) {
          lineItem = await this.lineItemRepository.get(userId, override.id as number, businessId)
        }

        // The lineitem does not have an Id, so create a
        // lineitem with quantity 0 before creating the override
        if (!lineItem) {
          lineItem = await this.lineItemRepository.create(
            userId, {
              ...override as s.lineitems.Insertable,
              job_id: updatedVisit.job_id,
              quantity: 0
            },
            businessId,
            txnClient
          )
        }

        // Create the override if it has a different quantity than the lineitem
        if (lineItem.quantity !== override.quantity) {
          await this.lineItemOverrideRepository.create(
            userId, {
              lineitem_id: lineItem.id,
              visit_id: updatedVisit.id,
              quantity: override.quantity as number
            },
            businessId, txnClient
          )
        }

        return {
          id: lineItem.id,
          visit_id: updatedVisit.id,
          quantity: override.quantity,
          name: lineItem.name,
          description: lineItem.description,
          unit_cost: lineItem.unit_cost
        }
      }))
      return [updatedVisit, updatedOverrides] as VisitSelectable
    })
  }

  async find (
    userId: string,
    where: VisitWhereable,
    { limit, offset, orderBy, orderDirection }: RepositoryOptions<s.visits.Table>,
    businessId?: number
  ) {
    const [totalCount, visits] = await this.repository.find(
      userId,
      where,
      { limit, offset, orderBy, orderDirection },
      businessId
    )
    return [totalCount, visits.map(visit => {
      const lineItems = visit.lineitems
      delete visit.lineitems
      return [visit, lineItems]
    })] as [number, VisitSelectable[]]
  }

  async get (userId: string, id: number, businessId: number) {
    const visit = await this.repository.get(userId, id, businessId)
    return [visit, visit?.lineitems] as VisitSelectable
  }
}

export default VisitService
