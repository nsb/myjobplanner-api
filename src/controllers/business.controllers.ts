import { Request, Response } from 'express'
import { IDbPool } from '../postgres'
import type { Business } from '../models/Business'

export class BusinessController {
  constructor(private db: IDbPool<Business>) { }
  public static inject = ['dbPool'] as const;

  async getAllBusinesses(req: Request, res: Response): Promise<void> {
    const result = await this.db.query('SELECT * from businesses ORDER BY id ASC')
    res.status(200).json(result.rows)
  }
}

export default BusinessController