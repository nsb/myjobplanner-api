import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IService } from './base.service'
import type { IClientRepository } from '../repositories/ClientRepository'

export interface IClientService extends IService<s.clients.Insertable, s.clients.Updatable, s.clients.JSONSelectable> {}

class ClientService implements IClientService {
    public static inject = ['pool', 'clientRepository'] as const;
    constructor (
        private pool: Pool,
        private clientRepository: IClientRepository
    ) {}

    async create (userId: string, business: s.clients.Insertable) {
      return db.readCommitted(this.pool, async txnClient => {
        return this.clientRepository.create(userId, business, undefined, txnClient)
      })
    }

    async update (userId: string, id: number, business: s.businesses.Updatable, businessId?: number) {
      return db.readCommitted(this.pool, async txnClient => {
        return this.clientRepository.update(
          userId,
          id,
          business,
          businessId,
          txnClient
        )
      })
    }
}

export default ClientService
