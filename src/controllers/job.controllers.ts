import * as s from 'zapatos/schema'
import type { QueryParams } from '../types'
import type * as db from 'zapatos/db'
import BaseController from './BaseController'

interface DTO {
  id?: number
  clientId: number
  propertyId: number
  recurrences: string | null
  begins: db.TimestampTzString;
  ends: db.TimestampTzString | null
  startTime: db.TimestampTzString | null
  finishTime: db.TimestampTzString | null
  anytime: boolean
  title: string | null
  description: string | null
  closed: boolean
  // eslint-disable-next-line camelcase
  invoice: s.invoice_job_choices
}

type JobQueryParams = QueryParams<DTO> & {
  clientId?: number
}

export class JobController extends BaseController<s.jobs.Insertable, s.jobs.Updatable, s.jobs.JSONSelectable, s.jobs.Whereable, s.jobs.Table, DTO, JobQueryParams> {
  public static inject = ['jobRepository', 'jobService'] as const;

  deserializeInsert (dto: DTO) {
    return {
      client_id: dto.clientId,
      property_id: dto.propertyId,
      recurrences: dto.recurrences,
      begins: dto.begins,
      ends: dto.ends,
      start_time: dto.startTime,
      finish_time: dto.finishTime,
      anytime: dto.anytime,
      title: dto.title,
      description: dto.description,
      closed: dto.closed,
      invoice: dto.invoice
    }
  }

  deserializeUpdate (dto: DTO) {
    return {
      client_id: dto.clientId,
      property_id: dto.propertyId,
      recurrences: dto.recurrences,
      begins: dto.begins,
      ends: dto.ends,
      start_time: dto.startTime,
      finish_time: dto.finishTime,
      anytime: dto.anytime,
      title: dto.title,
      description: dto.description,
      closed: dto.closed,
      invoice: dto.invoice
    }
  }

  serialize (model: s.jobs.JSONSelectable) {
    return {
      ...model,
      clientId: model.client_id,
      propertyId: model.property_id,
      startTime: model.start_time,
      finishTime: model.finish_time
    }
  }

  getOrderBy (key: keyof DTO) {
    switch (key) {
      case 'clientId':
        return 'client_id'
      case 'propertyId':
        return 'property_id'
      case 'startTime':
        return 'start_time'
      case 'finishTime':
        return 'finish_time'
      default:
        return key
    }
  }

  fromQuery (query: JobQueryParams) {
    const where: s.jobs.Whereable = {}
    if (query.clientId) {
      where.client_id = query.clientId
    }
    return where
  }
}

export default JobController
