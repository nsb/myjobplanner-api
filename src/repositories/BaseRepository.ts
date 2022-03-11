import * as s from 'zapatos/schema';
import type { defaultQueryParams, ListResponse } from '../types';

export interface IRepository<Insertable, Selectable, Whereable, Table extends s.Table> {
    create(userId: string, business: Insertable): Promise<Selectable>
    find(userId: string, business: Whereable, extraParams?: defaultQueryParams<Table>): Promise<ListResponse<Selectable>>
    get(userId: string, id: number): Promise<Selectable | undefined>
}
