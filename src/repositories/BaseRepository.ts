import * as s from 'zapatos/schema'
import type { RepositoryOptions, ListResponse } from '../types'

export interface IRepository<Insertable, Updatable, Selectable, Whereable, Table extends s.Table> {
    create(userId: string, item: Insertable, businessId?: number): Promise<Selectable>
    update(userId: string, id: number, item: Updatable, businessId?: number): Promise<Selectable>
    find(userId: string, where: Whereable, extraParams?: RepositoryOptions<Table>, businessId?: number): Promise<ListResponse<Selectable>>
    get(userId: string, id: number, businessId?: number): Promise<Selectable | undefined>
}
