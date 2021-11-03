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
  }: s.businesses.Selectable): Business {
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

    const [insertedBusiness] = await db.sql<s.businesses.SQL, s.businesses.Selectable[]>`
    INSERT INTO ${"businesses"} (${db.cols(business)})
    VALUES (${db.vals(business)}) RETURNING *`.run(this.pool)

    return BusinessRepository.toBusiness(insertedBusiness)
  }

  async find(item: Partial<Business>): Promise<Array<Business>> {
    const businesses = await db.sql<s.businesses.SQL, s.businesses.Selectable[]>`
      SELECT * from ${"businesses"} ORDER BY ID ASC`.run(this.pool)

    return businesses.map(BusinessRepository.toBusiness)
  }
}

export default BusinessRepository