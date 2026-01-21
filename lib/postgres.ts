import { Pool, QueryResult } from 'pg'

let pool: Pool

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  }
  return pool
}

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const client = await getPool().connect()
  try {
    return await client.query(text, params)
  } finally {
    client.release()
  }
}

export async function closePool() {
  if (pool) {
    await pool.end()
  }
}
