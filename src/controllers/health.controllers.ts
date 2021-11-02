import { Request, Response } from 'express'

export class HealthController {
  async getHealth(req: Request, res: Response): Promise<void> {
    res.status(200).json({ status: "Ok" })
  }
}

export default HealthController