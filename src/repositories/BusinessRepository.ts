import { Pool } from 'pg'
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';
import pool from '../postgres';
import BaseRepository from "../repository"

class BusinessRepository extends BaseRepository<s.businesses.Selectable> {
  constructor(private pool: Pool) {
    super()
  }
  public static inject = ['pool'] as const

  async find(item: Partial<s.businesses.Selectable>): Promise<Array<s.businesses.Selectable>> {
    return await db.sql<s.businesses.SQL, s.businesses.Selectable[]>`
      SELECT * from ${"businesses"} ORDER BY ID ASC`.run(pool)
  }
}

export default BusinessRepository