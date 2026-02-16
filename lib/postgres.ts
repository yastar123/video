import { Pool, QueryResult } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

let pool: Pool

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined')
    }
    
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    })
  }
  return pool
}

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const client = await getPool().connect()
  try {
    return await client.query(text, params)
  } catch (err) {
    console.error('Database Query Error:', { text, params, error: err })
    throw err
  } finally {
    client.release()
  }
}

export async function closePool() {
  if (pool) {
    await pool.end()
  }
}
