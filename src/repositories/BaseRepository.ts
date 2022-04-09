import * as s from 'zapatos/schema';
import type { RepositoryOptions, ListResponse } from '../types';

export interface IRepository<Insertable, Updatable, Selectable, Whereable, Table extends s.Table> {
    create(userId: string, item: Insertable): Promise<Selectable>
    update(userId: string, id: number, item: Updatable): Promise<Selectable>
    find(userId: string, where: Whereable, extraParams?: RepositoryOptions<Table>): Promise<ListResponse<Selectable>>
    get(userId: string, id: number): Promise<Selectable | undefined>
}
