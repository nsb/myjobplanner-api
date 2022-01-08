import { Request, Response } from 'express'
import BusinessRepository from '../repositories/BusinessRepository';

export class BusinessController {
  constructor(private repository: BusinessRepository) { }
  public static inject = ['businessRepository'] as const;

  async getBusinesses(req: Request, res: Response): Promise<void> {
    if (req.user) {
      const result = await this.repository.find(req.user.sub, req.params)
      res.status(200).json(result)
    }
  }
}

export default BusinessController