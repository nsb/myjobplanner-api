import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IService } from './base.service'
import type { IJobRepository } from '../repositories/JobRepository'
import { RepositoryOptions } from '../types'

export interface IJobService extends IService<s.jobs.Insertable, s.jobs.Updatable, s.jobs.JSONSelectable, s.jobs.Whereable, s.jobs.Table> {}

class JobService implements IJobService {
    public static inject = ['pool', 'jobRepository'] as const;
    constructor (
        private pool: Pool,
        private jobRepository: IJobRepository
    ) {}

    async create (userId: string, job: s.jobs.Insertable) {
      return db.readCommitted(this.pool, async txnClient => {
        return this.jobRepository.create(userId, job, undefined, txnClient)
      })
    }

    async update (userId: string, id: number, job: s.jobs.Updatable, businessId?: number) {
      return db.readCommitted(this.pool, async txnClient => {
        return this.jobRepository.update(
          userId,
          id,
          job,
          businessId,
          txnClient
        )
      })
    }

    async find (
      userId: string,
      where: s.jobs.Whereable,
      { limit, offset, orderBy, orderDirection }: RepositoryOptions<s.jobs.Table>,
      businessId?: number
    ) {
      return this.jobRepository.find(userId, where, { limit, offset, orderBy, orderDirection }, businessId)
    }

    async get (userId: string, id: number) {
      return this.jobRepository.get(userId, id)
    }
}

export default JobService
