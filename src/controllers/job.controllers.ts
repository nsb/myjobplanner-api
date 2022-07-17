/* eslint-disable no-unused-vars */
import * as s from 'zapatos/schema'
import type { components } from '../schema'
import type { QueryParams } from '../types'
import type * as db from 'zapatos/db'
import BaseController from './BaseController'

type JobDTO = components['schemas']['Job']
interface DTO extends JobDTO {
  begins: db.TimestampTzString
  ends: db.TimestampTzString | null
  startTime: db.TimestampTzString | null
  finishTime: db.TimestampTzString | null
}

type JobQueryParams = QueryParams<DTO> & {
  client?: string
}

export class JobController extends BaseController<
  [s.jobs.Insertable, s.lineitems.Insertable[], number[]],
  [s.jobs.Updatable, s.lineitems.Updatable[], number[]],
  [s.jobs.JSONSelectable, s.lineitems.JSONSelectable[], s.job_assignments.JSONSelectable[]],
  s.jobs.Whereable,
  s.jobs.Table,
  DTO,
  JobQueryParams
> {
  public static inject = ['jobService'] as const

  deserializeInsert (dto: DTO): [s.jobs.Insertable, s.lineitems.Insertable[], number[]] {
    const [_first, clientId] = this.getIdsFromURI(dto.client)
    const [_second, propertyId] = this.getIdsFromURI(dto.property)

    if (!clientId) {
      throw new Error('Invalid client Id')
    }

    if (!propertyId) {
      throw new Error('Invalid property Id')
    }

    const job = {
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
    }

    const lineItems = dto.lineItems.map((lineItem) => {
      if (!lineItem.name) {
        throw new Error('Name required in line item.')
      }
      const [_second, serviceId] = lineItem.serviceId ? this.getIdsFromURI(lineItem.serviceId) : [undefined, undefined]

      return {
        service_id: serviceId,
        name: lineItem.name,
        quantity: lineItem.quantity,
        unit_cost: lineItem.unitCost
      }
    })

    const assignments = dto.assigned.map(assigned => {
      const [_first, employeeId] = this.getIdsFromURI(assigned)
      return employeeId
    })

    return [job, lineItems, assignments]
  }

  deserializeUpdate (Id: number, dto: DTO): [s.jobs.Updatable, s.lineitems.Updatable[], number[]] {
    const [_first, clientId] = this.getIdsFromURI(dto.client)
    const [_second, propertyId] = this.getIdsFromURI(dto.property)

    if (!clientId) {
      throw new Error('Invalid client Id')
    }

    if (!propertyId) {
      throw new Error('Invalid property Id')
    }

    const job = {
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
    }

    const lineItems = dto.lineItems.map((lineItem) => {
      const [_second, serviceId] =
        lineItem.serviceId ? this.getIdsFromURI(lineItem.serviceId) : [undefined, undefined]

      return {
        id: Id,
        job_id: Id,
        service_id: serviceId,
        name: lineItem.name,
        quantity: lineItem.quantity,
        unit_cost: lineItem.unitCost
      }
    })

    const assignments = dto.assigned.map(assigned => {
      const [_second, employeeId] = this.getIdsFromURI(assigned)
      return employeeId
    })

    return [job, lineItems, assignments]
  }

  serialize (
    [model, lineitems, assignments]: [s.jobs.JSONSelectable, s.lineitems.JSONSelectable[], s.job_assignments.JSONSelectable[]],
    businessId?: number
  ) {
    return {
      ...model,
      id: `/businesses/${businessId}/jobs/${model.id}`,
      client: `/businesses/${businessId}/clients/${model.client_id}`,
      property: `/businesses/${businessId}/properties/${model.property_id}`,
      startTime: model.start_time,
      finishTime: model.finish_time,
      lineItems: lineitems.map(lineItem => {
        return {
          id: `/businesses/${businessId}/lineitems/${lineItem.id}`,
          serviceId: lineItem.service_id ? `/businesses/${businessId}/lineitems/${lineItem.service_id}` : null,
          description: lineItem.description,
          name: lineItem.name,
          quantity: lineItem.quantity,
          unitCost: lineItem.unit_cost
        }
      }) || [],
      assigned: assignments.map(assigned => {
        return `/businesses/${businessId}/employees/${assigned.employee_id}`
      })
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
    if (query.client) {
      const [_businessId, clientId] = this.getIdsFromURI(query.client)
      where.client_id = clientId
    }
    return where
  }
}

export default JobController
