import { Pool } from 'pg'

const pool = new Pool({
  user: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  host: `${process.env.POSTGRES_HOST}`,
  database: `${process.env.POSTGRES_DB}`,
  port: 5432
})

type Result<T> = {
  rows: Array<T>
}

export interface IDbPool<T> {
  query: (sql: string) => Promise<Result<T>>
}

export class DbPool implements IDbPool<any> {
  constructor(private pool: Pool) { }
  public static inject = ['pool'] as const

  public async query(sql: string) {
    return this.pool.query(sql)
  }
}

export default pool