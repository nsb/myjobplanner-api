import * as s from 'zapatos/schema';

export type QueryParams<T extends s.Table> = {
    limit?: string
    offset?: string
    orderBy?: s.SQLForTable<T>
    orderDirection?: 'ASC' | 'DESC'
}

export type RepositoryOptions<T extends s.Table> = {
    limit?: number,
    offset?: number,
    orderBy?: s.SQLForTable<T>,
    orderDirection?: 'ASC' | 'DESC'
}

export type ListResponse<T> = { totalCount: number, result: T[] }

export type ApiEnvelope<T> = {
    data: T[]
    meta: {
        totalCount: number
    }
}
