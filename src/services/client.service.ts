import * as s from 'zapatos/schema'
import { BaseService, IService } from './base.service'

export interface IClientService extends IService<s.clients.Insertable, s.clients.Updatable, s.clients.JSONSelectable, s.clients.Whereable, s.clients.Table> {}

class ClientService extends BaseService<s.clients.Insertable, s.clients.Updatable, s.clients.JSONSelectable, s.clients.Whereable, s.clients.Table> {
  public static inject = ['pool', 'clientRepository'] as const;
}

export default ClientService
