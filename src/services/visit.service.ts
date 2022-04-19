import * as s from 'zapatos/schema'
import { BaseService } from './base.service'

class VisitService extends BaseService<
  s.visits.Insertable,
  s.visits.Updatable,
  s.visits.JSONSelectable,
  [s.visits.Whereable, s.clients.Whereable],
  s.visits.Table
> {
    public static inject = ['pool', 'visitRepository'] as const;
}

export default VisitService
