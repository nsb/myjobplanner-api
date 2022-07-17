/* eslint-disable camelcase */
import { TimestampTzString } from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { components } from '../schema'
import type { QueryParams } from '../types'
import BaseController from './BaseController'

type VisitDTO = components['schemas']['Visit']
interface DTO extends VisitDTO {
  begins: TimestampTzString
  ends: TimestampTzString | null
}

type VisitQueryParams = QueryParams<DTO> & {
  client?: string,
  job?: string
}

export class VisitController extends BaseController<
  [s.visits.Insertable, s.lineitems.Insertable[] | s.lineitem_overrides.Insertable[]],
  [s.visits.Updatable, s.lineitems.Updatable[]],
  [s.visits.JSONSelectable, s.lineitems.JSONSelectable[]],
  [s.visits.Whereable, s.clients.Whereable],
  s.visits.Table, DTO,
  VisitQueryParams
> {
  public static inject = ['visitService'] as const

  deserializeInsert (dto: DTO): [s.visits.Insertable, s.lineitems.Insertable[] | s.lineitem_overrides.Insertable[]] {
    // eslint-disable-next-line no-unused-vars
    const [_first, jobId] = this.getIdsFromURI(dto.job)
    // eslint-disable-next-line no-unused-vars
    const [_second, invoiceId] = dto.invoice ? this.getIdsFromURI(dto.invoice) : [undefined, null]

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

  deserializeUpdate (Id: number, dto: DTO): [s.visits.Updatable, s.lineitems.Updatable[]] {
    // eslint-disable-next-line no-unused-vars
    const [_first, jobId] = this.getIdsFromURI(dto.job)
    // eslint-disable-next-line no-unused-vars
    const [_second, invoiceId] = dto.invoice ? this.getIdsFromURI(dto.invoice) : [undefined, null]

    if (!jobId) {
      throw new Error('Invalid job Id')
    }

    return [{
      id: Id,
      job_id: jobId,
      invoice_id: invoiceId,
      completed: dto.completed,
      begins: dto.begins,
      ends: dto.ends,
      anytime: dto.anytime
    },
    dto.lineItems.map(override => {
      // eslint-disable-next-line no-unused-vars
      const [_second, lineitemId] = override.id ? this.getIdsFromURI(override.id) : [undefined, undefined]

      return {
        id: lineitemId,
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
      id: `/businesses/${businessId}/visits/${model.id}`,
      job: `/businesses/${businessId}/jobs/${model.job_id}`,
      invoice: model.invoice_id ? `/businesses/${businessId}/invoices/${model.invoice_id}` : null,
      begins: model.begins as TimestampTzString,
      ends: model.ends as TimestampTzString,
      lineItems: lineItems.map(lineItem => {
        return {
          id: `/businesses/${businessId}/lineitems/${lineItem.id}`,
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
    if (query.job) {
      // eslint-disable-next-line no-unused-vars
      const [_first, jobId] = this.getIdsFromURI(query.job)
      visitWhere.job_id = jobId
    }
    const clientWhere: s.clients.Whereable = {}
    if (query.client) {
      // eslint-disable-next-line no-unused-vars
      const [_first, clientId] = this.getIdsFromURI(query.client)
      clientWhere.id = clientId
    }
    return [visitWhere, clientWhere]
  }
}

export default VisitController
