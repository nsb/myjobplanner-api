/* eslint-disable camelcase */
import { TimestampTzString } from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { QueryParams } from '../types'
import BaseController from './BaseController'

interface DTO {
  id?: number
  job: string
  invoice: string | null
  completed: boolean
  begins: TimestampTzString | null
  ends: TimestampTzString | null
  anytime: boolean,
  lineItems: Array<{
    id?: number
    name: string
    description: string | null
    unitCost: number
    quantity: number
  }>
}

type VisitQueryParams = QueryParams<DTO> & {
  clientId?: number,
  jobId?: number
}

export class VisitController extends BaseController<
  [s.visits.Insertable, s.lineitems.Insertable[]],
  [s.visits.Updatable, s.lineitems.Updatable[]],
  [s.visits.JSONSelectable, s.lineitems.JSONSelectable[]],
  [s.visits.Whereable, s.clients.Whereable],
  s.visits.Table, DTO,
  VisitQueryParams
> {
  public static inject = ['visitService'] as const

  deserializeInsert (dto: DTO): [s.visits.Insertable, s.lineitems.Insertable[]] {
    // eslint-disable-next-line no-unused-vars
    const [_first, jobId] = this.getIdsFromURI(dto.job)
    // eslint-disable-next-line no-unused-vars
    const [_second, invoiceId] = this.getIdsFromURI(dto.invoice)

    if (!jobId) {
      throw new Error('Invalid job Id')
    }

    return [{
      job_id: jobId,
      invoice_id: invoiceId,
      completed: dto.completed,
      begins: dto.begins,
      ends: dto.ends,
      anytime: dto.anytime
    }, dto.lineItems.map(override => {
      return {
        name: override.name,
        description: override.description,
        unit_cost: override.unitCost,
        quantity: override.quantity
      }
    })]
  }

  deserializeUpdate (dto: DTO): [s.visits.Updatable, s.lineitems.Updatable[]] {
    // eslint-disable-next-line no-unused-vars
    const [_first, jobId] = this.getIdsFromURI(dto.job)
    // eslint-disable-next-line no-unused-vars
    const [_second, invoiceId] = this.getIdsFromURI(dto.invoice)

    if (!jobId) {
      throw new Error('Invalid job Id')
    }

    return [{
      id: dto.id,
      job_id: jobId,
      invoice_id: invoiceId,
      completed: dto.completed,
      begins: dto.begins,
      ends: dto.ends,
      anytime: dto.anytime
    },
    dto.lineItems.map(override => {
      return {
        id: override.id,
        name: override.name,
        description: override.description,
        unit_cost: override.unitCost,
        quantity: override.quantity
      }
    })
    ]
  }

  serialize (
    [model, lineItems]: [s.visits.JSONSelectable, s.lineitems.JSONSelectable[]],
    businessId?: number
  ) {
    return {
      ...model,
      job: `/businesses/${businessId}/jobs/${model.job_id}`,
      invoice: model.invoice_id ? `/businesses/${businessId}/invoices/${model.invoice_id}` : null,
      lineItems: lineItems.map(lineItem => {
        return {
          id: lineItem.id,
          description: lineItem.description,
          name: lineItem.name,
          unitCost: lineItem.unit_cost,
          quantity: lineItem.quantity
        }
      })
    }
  }

  getOrderBy (key: keyof DTO) {
    switch (key) {
      case 'job':
        return 'job_id'
      case 'invoice':
        return 'invoice_id'
      default:
        return 'created'
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
