import { inject, injectable } from 'inversify'
import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { ListResponse, RepositoryOptions } from '../types'
import type { IRepository } from './BaseRepository'

export interface IJobAssignmentRepository extends IRepository<
  s.job_assignments.Insertable,
  s.job_assignments.Updatable,
  s.job_assignments.JSONSelectable,
  s.job_assignments.Whereable,
  s.job_assignments.Table
> {
  delete(
    userId: string,
    where: s.job_assignments.Whereable,
    businessId?: number
  ): Promise<s.job_assignments.JSONSelectable[]>
 }

@injectable()
class JobAssignmentRepository implements IJobAssignmentRepository {
  constructor (@inject('pool') private pool: Pool) { }

  async create (
    _userId: string,
    assignment: s.job_assignments.Insertable,
    _businessId: number,
    txnClient?: db.TxnClientForReadCommitted
  ) {
    // TODO: Validate business membership
    return db.insert('job_assignments', assignment).run(txnClient || this.pool)
  }

  async update (
    _userId: string,
    id: number,
    assignment: s.job_assignments.Updatable,
    _businessId: number,
    txnClient?: db.TxnClientForReadCommitted
  ) {
    const updatedAssignments = await db.update(
      'job_assignments',
      assignment,
      { id }
    ).run(txnClient || this.pool)
    return updatedAssignments[0]
  }

  async find (
    _userId: string,
    _business?: s.job_assignments.Whereable,
    _options?: RepositoryOptions<s.job_assignments.Table>
  ) {
    // TODO: Not implemented yet
    return [
      0, []
    ] as ListResponse<s.job_assignments.JSONSelectable>
  }

  async get (_userId: string, id: number) {
    return db.selectOne('job_assignments', { id }).run(this.pool)
  }

  async delete (
    _userId: string,
    assignment: s.job_assignments.Whereable,
    _businessId?: number,
    txnClient?: db.TxnClientForReadCommitted) {
    return db.deletes('job_assignments', assignment).run(txnClient || this.pool)
  }
}

export default JobAssignmentRepository
