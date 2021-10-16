import type { Pool } from 'pg'
import { Request, Response, Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'

export class BusinessController {
  constructor(private db: Pool) { }
  public static inject = ['db'] as const;

  async getAllBusinesses(req: Request, res: Response): Promise<void> {
    const result = await this.db.query('SELECT * from businesses ORDER BY id ASC')
    res.status(200).json(result.rows)
  }
}

function createBusinessRouter(businessController: BusinessController) {
  const router = Router()
  router.get('/', checkJwt, jwtAuthz(['read:business']), businessController.getAllBusinesses.bind(businessController))
  return router
}
createBusinessRouter.inject = ['businessController'] as const

export default createBusinessRouter