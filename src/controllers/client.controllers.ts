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

type ClientQueryParams = QueryParams<ClientDTO> & {
  businessId?: number
}

export function fromQuery(query: ClientQueryParams): s.clients.Whereable {
  const where: s.clients.Whereable = {}
  if (query.businessId) {
    where.business_id = query.businessId
  }
  return where
}

export function getClientOrderBy(key: keyof ClientDTO): s.SQLForTable<s.clients.Table> {
  switch (key) {
    case 'businessId':
      return 'business_id'
    case 'firstName':
      return 'first_name'
    case 'lastName':
      return 'last_name'
    default:
      return key
  }
}

export class ClientController extends BaseController<s.clients.Insertable, s.clients.JSONSelectable, s.clients.Whereable, s.clients.Table, ClientDTO, ClientQueryParams> {
  public static inject = ['clientRepository', 'clientTransformer', 'clientQuery', 'getClientOrderBy'] as const;
}

export default ClientController