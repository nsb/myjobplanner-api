import { Request, Response } from "express";
import { Service } from 'typedi'
import db from '../postgres'

@Service()
class BusinessController {
  async getAllBusinesses(req: Request, res: Response): Promise<void> {
    const result = await db.query('SELECT * from businesses ORDER BY id ASC')
    res.status(200).json(result.rows)
  }
}

export default BusinessController