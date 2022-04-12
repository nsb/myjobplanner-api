import * as s from 'zapatos/schema'
import { ListResponse, RepositoryOptions } from '../types'

export interface IService<Insertable, Updatable, Selectable, Whereable, Table extends s.Table> {
    create (userId: string, insertable: Insertable, businessId?: number): Promise<Selectable>
    update (userId: string, id: number, business: Updatable, businessId?: number): Promise<Selectable>
    find (userId: string, where: Whereable, options: RepositoryOptions<Table>, businessId?: number): Promise<ListResponse<Selectable>>
}
