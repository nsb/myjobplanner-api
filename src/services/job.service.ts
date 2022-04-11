import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IService } from './base.service'
import type { IJobRepository } from '../repositories/JobRepository'

export interface IJobService extends IService<s.jobs.Insertable, s.jobs.Updatable, s.jobs.JSONSelectable> {}

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
}

export default JobService
