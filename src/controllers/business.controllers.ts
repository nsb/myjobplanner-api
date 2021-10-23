import { Request, Response } from 'express'
import { IDbPool } from '../postgres'
import type { Business } from '../models/business'
import * as db from 'zapatos/db';
import type * as s from 'zapatos/schema';

export class BusinessController {
  constructor(private pool: IDbPool<Business>) { }
  public static inject = ['dbPool'] as const;

  async getBusinesses(req: Request, res: Response): Promise<void> {

    const query = db.sql<s.businesses.SQL, s.businesses.Selectable[]>`
      SELECT * from ${"businesses"} ORDER BY ID ASC`.compile()

    const result = await this.pool.query(query.text, query.values)
    res.status(200).json(result.rows)
  }
}

export default BusinessController