import { Request, Response, NextFunction } from 'express'
import * as s from 'zapatos/schema';
import { IRepository } from '../repositories/BaseRepository'
import type { ITransformer } from '../types'

export abstract class BaseController<Insertable, Selectable, Whereable, Table extends s.Table, DTO> {
  constructor(
    public repository: IRepository<Insertable, Selectable, Whereable, Table>,
    public transformer: ITransformer<DTO, Insertable, Selectable>
  ) { }

  async create(req: Request<{}, {}, DTO>, res: Response<DTO>, next: NextFunction): Promise<void> {
    if (req.user) {
      try {
        const result = await this.repository.create(
          req.user.sub,
          this.transformer.deserialize(req.body)
        )
        res.status(200).json(this.transformer.serialize(result))
      } catch (err) {
        next(err)
      }
    }
  }
}

export default BaseController