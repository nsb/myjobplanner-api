import * as s from 'zapatos/schema'
import { BaseService, IService } from './base.service'

type VisitInsertable = [s.visits.Insertable, s.lineitems.Insertable[]]
type VisitUpdatable = [s.visits.Updatable, (s.lineitems.Updatable | s.lineitems.Insertable)[]]
type VisitSelectable = [s.visits.JSONSelectable, s.lineitems.JSONSelectable[]]
type VisitWhereable = [s.visits.Whereable, s.clients.Whereable]

export interface IVisitService extends IService<
  VisitInsertable,
  VisitUpdatable,
  VisitSelectable,
  VisitWhereable,
  s.visits.Table
> {}

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
