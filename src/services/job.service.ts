import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IService } from './base.service'
import type { IJobRepository } from '../repositories/JobRepository'
import type { RepositoryOptions } from '../types'
import type { ILineItemRepository } from '../repositories/LineItemRepository'
import { IJobAssignmentRepository } from '../repositories/JobAssignmentRepository'

type JobInsertable = [s.jobs.Insertable, s.lineitems.Insertable[], number[]]
type JobUpdatable = [s.jobs.Updatable, Array<s.lineitems.Updatable | s.lineitems.Insertable>, number[] ]
type JobSelectable = [s.jobs.JSONSelectable, s.lineitems.JSONSelectable[], s.job_assignments.JSONSelectable[]]

export interface IJobService extends IService<
  JobInsertable,
  JobUpdatable,
  JobSelectable,
  s.jobs.Whereable,
  s.jobs.Table
> {}

class JobService implements IJobService {
  public static inject = ['pool', 'jobRepository', 'lineItemRepository', 'jobAssignmentRepository'] as const
  constructor (
        private pool: Pool,
        private jobRepository: IJobRepository,
        private lineItemRepository: ILineItemRepository,
        private jobAssignmentRepository: IJobAssignmentRepository
  ) {}

  async create (
    userId: string,
    [job, lineItems, assignments]: JobInsertable,
    businessId: number
  ) {
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
      const createdAssignments: s.job_assignments.Insertable[] = await Promise.all(assignments.map(assignment => {
        return this.jobAssignmentRepository.create(
          userId, {
            job_id: job.id as number,
            employee_id: assignment
          },
          businessId,
          txnClient
        )
      }))

      return [createdJob, createdLineItems, createdAssignments] as JobSelectable
    })
  }

  async update (
    userId: string,
    id: number,
    [job, lineItems, assignments]: JobUpdatable,
    businessId: number
  ) {
    return db.readCommitted(this.pool, async txnClient => {
      const updatedJob = await this.jobRepository.update(
        userId,
        id,
        job,
        businessId,
        txnClient
      )
      const updatedLineItems = await Promise.all(lineItems.map((lineItem) => {
        return lineItem.id
          ? this.lineItemRepository.update(
            userId, lineItem.id as number, { ...lineItem, job_id: updatedJob.id }, businessId, txnClient)
          : this.lineItemRepository.create(
            userId, { ...lineItem as s.lineitems.Insertable, job_id: updatedJob.id }, businessId, txnClient
          )
      }))

      const updatedAssignments: s.job_assignments.Updatable[] = await Promise.all(assignments.map(assignment => {
        return this.jobAssignmentRepository.update(
          userId,
          id, {
            job_id: job.id as number,
            employee_id: assignment
          },
          businessId,
          txnClient
        )
      }))

      return [updatedJob, updatedLineItems, updatedAssignments] as JobSelectable
    })
  }

  async find (
    userId: string,
    where: s.jobs.Whereable,
    { limit, offset, orderBy, orderDirection }: RepositoryOptions<s.jobs.Table>,
    businessId?: number
  ) {
    const [totalCount, jobs] = await this.jobRepository.find(
      userId,
      where,
      { limit, offset, orderBy, orderDirection },
      businessId
    )
    return [totalCount, jobs.map(job => [job, job.lineitems, job.assigned])] as [number, JobSelectable[]]
  }

  async get (userId: string, id: number, businessId: number) {
    const job = await this.jobRepository.get(userId, id, businessId)
    return [job, job?.lineitems, job?.assigned] as JobSelectable
  }
}

export default JobService
