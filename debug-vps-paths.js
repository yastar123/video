#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('=== VPS Upload Path Debugging ===')
console.log('')

// Check environment
console.log('Environment Variables:')
console.log('- NODE_ENV:', process.env.NODE_ENV || 'undefined')
console.log('- UPLOAD_DIR:', process.env.UPLOAD_DIR || 'undefined')
console.log('- Current working directory:', process.cwd())
console.log('')

// Check possible upload directories
const possiblePaths = [
  '/root/video/uploads',
  path.join(process.cwd(), 'uploads'),
  path.join(process.cwd(), 'public', 'uploads'),
  '/tmp/uploads',
  '/var/tmp/uploads'
]

console.log('Checking possible upload directories:')
possiblePaths.forEach((dirPath, index) => {
  const exists = fs.existsSync(dirPath)
  const stats = exists ? fs.statSync(dirPath) : null
  console.log(`${index + 1}. ${dirPath}`)
  console.log(`   Exists: ${exists}`)
  if (exists && stats) {
    console.log(`   Type: ${stats.isDirectory() ? 'Directory' : 'File'}`)
    if (stats.isDirectory()) {
      try {
        const files = fs.readdirSync(dirPath)
        console.log(`   Files count: ${files.length}`)
        if (files.length > 0) {
          console.log(`   Recent files: ${files.slice(0, 5).join(', ')}`)
        }
      } catch (error) {
        console.log(`   Cannot read directory: ${error.message}`)
      }
    }
  }
  console.log('')
})

// Check specific file if provided
const testFile = process.argv[2]
if (testFile) {
  console.log(`Checking specific file: ${testFile}`)
  const possibleFilePaths = possiblePaths.map(dir => path.join(dir, testFile))
  
  possibleFilePaths.forEach((filePath, index) => {
    const exists = fs.existsSync(filePath)
    const stats = exists ? fs.statSync(filePath) : null
    console.log(`${index + 1}. ${filePath}`)
    console.log(`   Exists: ${exists}`)
    if (exists && stats) {
      console.log(`   Size: ${stats.size} bytes`)
      console.log(`   Modified: ${stats.mtime}`)
    }
    console.log('')
  })
}

console.log('=== End Debugging ===')
