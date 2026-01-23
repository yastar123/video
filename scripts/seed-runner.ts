import { seedUsers } from '../lib/seed'
import { closePool } from '../lib/postgres'

async function runSeed() {
  console.log('Starting seed...')
  try {
    await seedUsers()
    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  } finally {
    await closePool()
    process.exit(0)
  }
}

runSeed()
