import * as s from 'zapatos/schema'
import { BaseService } from './base.service'

type VisitInsertable = [s.visits.Insertable, s.lineitems.Insertable[]]
type VisitUpdatable = [s.visits.Updatable, (s.lineitems.Updatable | s.lineitems.Insertable)[]]
type VisitSelectable = [s.visits.JSONSelectable, s.lineitems.JSONSelectable[]]

class VisitService extends BaseService<
  VisitInsertable,
  VisitUpdatable,
  VisitSelectable,
  [s.visits.Whereable, s.clients.Whereable],
  s.visits.Table
> {
    public static inject = ['pool', 'visitRepository'] as const;
}

export default VisitService
