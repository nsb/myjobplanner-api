import { TimestampTzString } from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { QueryParams } from '../types'
import BaseController from './BaseController'

interface DTO {
  id?: number
  jobId: number
  invoiceId: number
  completed: boolean
  begins: TimestampTzString | null
  ends: TimestampTzString | null
  anytime: boolean
}

type VisitQueryParams = QueryParams<DTO> & {
  clientId?: number,
  jobId?: number
}

export class VisitController extends BaseController<s.visits.Insertable, s.visits.Updatable, s.visits.JSONSelectable, [s.visits.Whereable, s.clients.Whereable], s.visits.Table, DTO, VisitQueryParams> {
  public static inject = ['visitService'] as const;

  deserializeInsert (dto: DTO) {
    return {
      job_id: dto.jobId,
      invoice_id: dto.invoiceId,
      completed: dto.completed,
      begins: dto.begins,
      ends: dto.ends,
      anytime: dto.anytime
    }
  }

  deserializeUpdate (dto: DTO) {
    return {
      job_id: dto.jobId,
      invoice_id: dto.invoiceId,
      completed: dto.completed,
      begins: dto.begins,
      ends: dto.ends,
      anytime: dto.anytime
    }
  }

  serialize (model: s.visits.JSONSelectable) {
    return {
      ...model,
      jobId: model.job_id,
      invoiceId: model.invoice_id
    }
  }

  getOrderBy (key: keyof DTO) {
    switch (key) {
      case 'jobId':
        return 'job_id'
      case 'invoiceId':
        return 'invoice_id'
      default:
        return key
    }
  }

  fromQuery (query: VisitQueryParams): [s.visits.Whereable, s.clients.Whereable] {
    const visitWhere: s.visits.Whereable = {}
    if (query.jobId) {
      visitWhere.job_id = query.jobId
    }
    const clientWhere: s.clients.Whereable = {}
    if (query.clientId) {
      clientWhere.id = query.clientId
    }
    return [visitWhere, clientWhere]
  }
}

export default VisitController
