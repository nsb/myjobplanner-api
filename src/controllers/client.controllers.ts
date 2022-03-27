import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema'
import BaseController from './BaseController'
import type { ApiEnvelope, QueryParams, ITransformer } from '../types'

interface ClientDTO {
  id?: number
  businessId: number
  firstName: string | null
  lastName: string | null
}

export class ClientTransformer implements ITransformer<ClientDTO, s.clients.Insertable, s.clients.JSONSelectable> {
  deserialize(dto: ClientDTO): s.clients.Insertable {
    return {
      business_id: dto.businessId,
      first_name: dto.firstName,
      last_name: dto.lastName
    }
  }

  serialize(model: s.clients.JSONSelectable): ClientDTO {
    return {
      ...model,
      businessId: model.business_id,
      firstName: model.first_name,
      lastName: model.last_name
    }
  }
}

type ClientQueryParams = QueryParams<s.clients.Table> & {
  businessId?: number
}

export function fromQuery(query: ClientQueryParams): s.clients.Whereable {
  const where: s.clients.Whereable = {}
  if (query.businessId) {
    where.business_id = query.businessId
  }
  return where
}

export class ClientController extends BaseController<s.clients.Insertable, s.clients.JSONSelectable, s.clients.Whereable, s.clients.Table, ClientDTO, ClientQueryParams> {
  public static inject = ['clientRepository', 'clientTransformer', 'clientQuery'] as const;
}

export default ClientController