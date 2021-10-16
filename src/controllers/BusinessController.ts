import { Request, Response, Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
import checkJwt from '../jwt'
import { IDbPool } from '../postgres'

export class BusinessController {
  constructor(private db: IDbPool) { }
  public static inject = ['dbPool'] as const;

  async getAllBusinesses(req: Request, res: Response): Promise<void> {
    const result = await this.db.query('SELECT * from businesses ORDER BY id ASC')
    res.status(200).json(result.rows)
  }
}

function BusinessRouter(businessController: BusinessController) {
  const router = Router()
  router.get('/', checkJwt, jwtAuthz(['read:business']), businessController.getAllBusinesses.bind(businessController))
  return router
}
BusinessRouter.inject = ['businessController'] as const

export default BusinessRouter