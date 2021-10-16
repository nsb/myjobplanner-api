import type { Pool } from 'pg'
import { Request, Response } from "express";

class BusinessController {
  constructor(private db: Pool) { }
  public static inject = ['db'] as const;

  async getAllBusinesses(req: Request, res: Response): Promise<void> {
    const result = await this.db.query('SELECT * from businesses ORDER BY id ASC')
    res.status(200).json(result.rows)
  }
}

export default BusinessController