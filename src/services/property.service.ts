import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'
import type { IService } from './base.service'
import type { IPropertyRepository } from '../repositories/PropertyRepository'

export interface IPropertyService extends IService<s.properties.Insertable, s.properties.Updatable, s.properties.JSONSelectable> {}

class PropertyService implements IPropertyService {
    public static inject = ['pool', 'propertyRepository'] as const;
    constructor (
        private pool: Pool,
        private propertyRepository: IPropertyRepository
    ) {}

    async create (userId: string, property: s.properties.Insertable) {
      return db.readCommitted(this.pool, async txnClient => {
        return this.propertyRepository.create(userId, property, undefined, txnClient)
      })
    }

    async update (userId: string, id: number, property: s.properties.Updatable, businessId?: number) {
      return db.readCommitted(this.pool, async txnClient => {
        return this.propertyRepository.update(
          userId,
          id,
          property,
          businessId,
          txnClient
        )
      })
    }
}

export default PropertyService
