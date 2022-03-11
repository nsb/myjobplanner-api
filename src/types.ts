import * as s from 'zapatos/schema';

export type defaultQueryParams<T extends s.Table> = {
    limit: number,
    offset: number,
    orderBy: s.SQLForTable<T>,
    orderDirection: 'ASC' | 'DESC'
}

export type ListResponse<T> = { totalCount: number, result: T[] }
