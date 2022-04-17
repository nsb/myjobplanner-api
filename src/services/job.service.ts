import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IService } from './base.service'
import type { IJobRepository } from '../repositories/JobRepository'
import type { RepositoryOptions } from '../types'
import type { ILineItemRepository } from '../repositories/LineItemRepository'

type JobInsertable = [s.jobs.Insertable, s.lineitems.Insertable[]]
type JobUpdatable = [s.jobs.Updatable, s.lineitems.Updatable[]]
type JobSelectable = [s.jobs.JSONSelectable, s.lineitems.JSONSelectable[]]

export interface IJobService extends IService<
  JobInsertable,
  JobUpdatable,
  JobSelectable,
  s.jobs.Whereable,
  s.jobs.Table
> {}

class JobService implements IJobService {
    public static inject = ['pool', 'jobRepository', 'lineItemRepository'] as const;
    constructor (
        private pool: Pool,
        private jobRepository: IJobRepository,
        private lineItemRepository: ILineItemRepository
    ) {}

    async create (userId: string, [job, lineItems]: JobInsertable, businessId?: number) {
      return db.readCommitted(this.pool, async txnClient => {
        const createdJob = await this.jobRepository.create(
          userId,
          job,
          businessId,
          txnClient
        )
        const createdLineItems = await Promise.all(lineItems.map((lineItem) => {
          return this.lineItemRepository.create(
            userId, { ...lineItem, job_id: createdJob.id }, businessId, txnClient
          )
        }))
        return [createdJob, createdLineItems] as JobSelectable
      })
    }

    async update (userId: string, id: number, [job, _lineItems]: JobUpdatable, businessId?: number) {
      return db.readCommitted(this.pool, async txnClient => {
        const updatedJob = await this.jobRepository.update(
          userId,
          id,
          job,
          businessId,
          txnClient
        )
        return [updatedJob, []] as JobSelectable
      })
    }

    async find (
      userId: string,
      where: s.jobs.Whereable,
      { limit, offset, orderBy, orderDirection }: RepositoryOptions<s.jobs.Table>,
      businessId?: number
    ) {
      const [totalCount, jobs] = await this.jobRepository.find(userId, where, { limit, offset, orderBy, orderDirection }, businessId)
      return [totalCount, jobs.map(job => [job, job.lineitems])] as [number, JobSelectable[]]
    }

    async get (userId: string, id: number) {
      const job = await this.jobRepository.get(userId, id)
      return [job, job?.lineitems] as JobSelectable
    }
}

export default JobService
