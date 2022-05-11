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
        if (override.id) {
          lineItem = await this.lineItemRepository.get(userId, override.id as number, businessId)
        }

        if (!lineItem) {
          lineItem = await this.lineItemRepository.create(userId, { ...override, job_id: createdVisit.job_id, quantity: 0 }, businessId, txnClient)
        }

        if (lineItem.quantity !== override.quantity) {
          await this.lineItemOverrideRepository.create(
            userId, { lineitem_id: lineItem.id, visit_id: createdVisit.id, quantity: override.quantity }, businessId, txnClient
          )
        }

        return {
          id: lineItem.id,
          visit_id: visit.id,
          quantity: override.quantity,
          name: lineItem.name,
          description: lineItem.description,
          unit_cost: lineItem.unit_cost
        }
      }))
      return [createdVisit, createdOverrides] as VisitSelectable
    })
  }

  async update (userId: string, id: number, [job, lineItems]: VisitUpdatable, businessId?: number) {
    return db.readCommitted(this.pool, async txnClient => {
      const updatedJob = await this.repository.update(
        userId,
        id,
        job,
        businessId,
        txnClient
      )
      // const updatedLineItems = await Promise.all(lineItems.map((lineItem) => {
      //   return lineItem.id
      //     ? this.lineItemRepository.update(
      //       userId, lineItem.id as number, { ...lineItem, job_id: updatedJob.id }, businessId, txnClient)
      //     : this.lineItemRepository.create(
      //       userId, { ...lineItem as s.lineitems.Insertable, job_id: updatedJob.id }, businessId, txnClient
      //     )
      // }))

      return [updatedJob, []] as VisitSelectable
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
