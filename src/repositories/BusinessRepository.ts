import { Pool } from 'pg'
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';
import BaseRepository from "../repository"
import type Business from '../models/business'


class BusinessRepository extends BaseRepository<Business> {
  constructor(private pool: Pool) {
    super()
  }
  public static inject = ['pool'] as const

  private static toBusiness({
    id,
    name,
    email,
    country_code,
    timezone
  }: s.businesses.JSONSelectable): Business {
    return {
      id,
      name,
      email,
      countryCode: country_code,
      timezone
    }
  }

  async create({ name, timezone, countryCode, email }: Business): Promise<Business> {

    const business: s.businesses.Insertable = {
      name,
      timezone,
      country_code: countryCode,
      email,
    }

    const insertedBusiness = await db.insert('businesses', business).run(this.pool)
    return BusinessRepository.toBusiness(insertedBusiness)
  }

  async find(item: Partial<Business>): Promise<Array<Business>> {
    const businesses = await db.select('businesses', db.all).run(this.pool)
    return businesses.map(BusinessRepository.toBusiness)
  }
}

export default BusinessRepository