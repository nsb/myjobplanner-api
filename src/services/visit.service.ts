import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
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
    public static inject = ['pool', 'visitRepository'] as const;
    constructor (
      private pool: Pool,
      private repository: IVisitRepository
    ) {}

    async create (userId: string, [visit, lineItems]: VisitInsertable, businessId?: number) {
      return db.readCommitted(this.pool, async txnClient => {
        const createdJob = await this.repository.create(
          userId,
          visit,
          businessId,
          txnClient
        )
        // const createdLineItems = await Promise.all(lineItems.map((lineItem) => {
        //   return this.lineItemRepository.create(
        //     userId, { ...lineItem, job_id: createdJob.id }, businessId, txnClient
        //   )
        // }))
        return [createdJob, []] as VisitSelectable
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
      return [totalCount, visits.map(visit => [visit, visit.lineitems])] as [number, VisitSelectable[]]
    }

    async get (userId: string, id: number, businessId: number) {
      const visit = await this.repository.get(userId, id, businessId)
      return [visit, visit?.lineitems] as VisitSelectable
    }
}

export default VisitService
