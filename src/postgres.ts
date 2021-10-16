import { Pool } from 'pg'

const pool = new Pool({
  user: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  host: `${process.env.POSTGRES_HOST}`,
  database: `${process.env.POSTGRES_DB}`,
  port: 5432
})

type Result = {
  rows: Array<any>
}

export interface IDbPool {
  query: (sql: string) => Promise<Result>
}

export class DbPool implements IDbPool {
  constructor(private pool: Pool) { }
  public static inject = ['pool'] as const

  public async query(sql: string) {
    return this.pool.query(sql)
  }
}

export default pool