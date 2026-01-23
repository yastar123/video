import { query, closePool } from '../lib/postgres'
import fs from 'fs'
import path from 'path'

async function dbPush() {
  console.log('Starting database push...')
  try {
    const sqlPath = path.join(process.cwd(), 'scripts', 'init-db.sql')
    if (fs.existsSync(sqlPath)) {
      const initSql = fs.readFileSync(sqlPath, 'utf8')
      await query(initSql)
      console.log('Database schema pushed successfully')
    } else {
      console.error('init-db.sql not found')
    }
  } catch (error) {
    console.error('Database push failed:', error)
    process.exit(1)
  } finally {
    await closePool()
    process.exit(0)
  }
}

dbPush()
