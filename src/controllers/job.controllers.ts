/* eslint-disable no-unused-vars */
import * as s from 'zapatos/schema'
import type { QueryParams } from '../types'
import type * as db from 'zapatos/db'
import BaseController from './BaseController'

interface DTO {
  id?: number
  client: string
  property: string
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
  lineItems: Array<{
    id?: number
    serviceId: number | null
    name: string
    quantity: number
    unitCost: number
  }>
}

type JobQueryParams = QueryParams<DTO> & {
  clientId?: number
}

export class JobController extends BaseController<
  [s.jobs.Insertable, s.lineitems.Insertable[]],
  [s.jobs.Updatable, s.lineitems.Updatable[]],
  [s.jobs.JSONSelectable, s.lineitems.JSONSelectable[]],
  s.jobs.Whereable,
  s.jobs.Table,
  DTO,
  JobQueryParams
> {
  public static inject = ['jobService'] as const

  deserializeInsert (dto: DTO): [s.jobs.Insertable, s.lineitems.Insertable[]] {
    const [_first, clientId] = this.getIdsFromURI(dto.client)
    const [_second, propertyId] = this.getIdsFromURI(dto.property)

    if (!clientId) {
      throw new Error('Invalid client Id')
    }

    if (!propertyId) {
      throw new Error('Invalid property Id')
    }

    return [{
      client_id: clientId,
      property_id: propertyId,
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
    }, dto.lineItems.map((lineItem) => {
      return {
        service_id: lineItem.serviceId,
        name: lineItem.name,
        quantity: lineItem.quantity,
        unit_cost: lineItem.unitCost
      }
    })]
  }

  deserializeUpdate (dto: DTO): [s.jobs.Updatable, s.lineitems.Updatable[]] {
    const [_first, clientId] = this.getIdsFromURI(dto.client)
    const [_second, propertyId] = this.getIdsFromURI(dto.property)

    if (!clientId) {
      throw new Error('Invalid client Id')
    }

    if (!propertyId) {
      throw new Error('Invalid property Id')
    }

    return [{
      client_id: clientId,
      property_id: propertyId,
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
    }, dto.lineItems.map((lineItem) => {
      return {
        id: dto.id,
        job_id: dto.id,
        service_id: lineItem.serviceId,
        name: lineItem.name,
        quantity: lineItem.quantity,
        unit_cost: lineItem.unitCost
      }
    })]
  }

  serialize (
    [model, lineitems]: [s.jobs.JSONSelectable, s.lineitems.JSONSelectable[]],
    businessId?: number
  ) {
    return {
      ...model,
      client: `/businesses/${businessId}/clients/${model.client_id}`,
      property: `/businesses/${businessId}/properties/${model.property_id}`,
      startTime: model.start_time,
      finishTime: model.finish_time,
      lineItems: lineitems?.map((lineItem) => {
        return {
          id: lineItem.id,
          serviceId: lineItem.service_id,
          name: lineItem.name,
          quantity: lineItem.quantity,
          unitCost: lineItem.unit_cost
        }
      }) || []
    }
  }

  getOrderBy (key: keyof DTO) {
    switch (key) {
      case 'client':
        return 'client_id'
      case 'property':
        return 'property_id'
      case 'startTime':
        return 'start_time'
      case 'finishTime':
        return 'finish_time'
      default:
        return 'created'
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
