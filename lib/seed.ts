import bcrypt from 'bcryptjs'
import { query } from './postgres'
import fs from 'fs'
import path from 'path'

export async function seedUsers() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  await query(`
    INSERT INTO users (username, email, password, role)
    VALUES 
      ('Admin', 'admin@streamflix.com', $1, 'admin'),
      ('User', 'user@streamflix.com', $2, 'user')
    ON CONFLICT (email) DO NOTHING
  `, [adminPassword, userPassword])
  
  console.log('Users seeded successfully')
}
