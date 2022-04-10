import { Request, Response, NextFunction, response } from 'express'
import { Pool } from 'pg'
import * as db from 'zapatos/db'
import * as s from 'zapatos/schema'

function poolDecorator (pool: Pool) {
  // eslint-disable-next-line camelcase
  return function permit (...permittedRoles: s.employee_role[]) {
    return async (req: Request<{businessId?: string}>, res: Response, next: NextFunction) => {
      const where = req.params.businessId
        ? {
            user_id: req.user?.sub,
            business_id: parseInt(req.params.businessId, 10)
          }
        : {
            user_id: req.user?.sub
          }

      try {
        const employee = await db.selectOne('employees', where).run(pool)

        if (employee && permittedRoles.includes(employee.role)) {
          next()
        } else {
          response.status(403).json({ message: 'Forbidden' })
        }
      } catch (error) {
        response.status(403).json({ messages: 'Forbidden' })
      }
    }
  }
}
poolDecorator.inject = ['pool'] as const

export default poolDecorator
