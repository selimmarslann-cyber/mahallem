/**
 * Execute SQL in Supabase using PostgreSQL client
 * Uses DATABASE_URL from .env
 */

import { config } from 'dotenv'
import { Client } from 'pg'
import { readFileSync } from 'fs'
import { join } from 'path'

// Load .env file
config({ path: join(process.cwd(), '.env') })

async function executeSQL(sql: string, description: string) {
  console.log(`\n📝 ${description}...\n`)

  // Try DIRECT_URL first (for migrations), then DATABASE_URL
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL or DIRECT_URL environment variable is not set')
  }

  console.log('📡 Connecting to database...')

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false, // Supabase için gerekli
    },
  })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    // SQL'i çalıştır
    await client.query(sql)

    console.log(`✅ ${description} completed successfully!\n`)

  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`)
    
    // "already exists" hatalarını yok say
    if (
      error.message.includes('already exists') ||
      error.message.includes('duplicate') ||
      error.message.includes('42710') // PostgreSQL duplicate object error code
    ) {
      console.log('ℹ️  Object already exists, skipping...\n')
    } else {
      throw error
    }
  } finally {
    await client.end()
    console.log('🔌 Database connection closed\n')
  }
}

// Main function to check and create missing tables
async function main() {
  console.log('🚀 Checking and creating missing tables in Supabase...\n')

  // Check which migration files exist
  const { readdirSync } = await import('fs')
  const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort()

  console.log(`📁 Found ${migrationFiles.length} migration files\n`)

  // List all migration files
  console.log('📋 Migration files:')
  migrationFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`)
  })
  console.log()

  // Check if user wants to apply all or specific migrations
  console.log('💡 To apply migrations:')
  console.log('   1. Run this script with a specific migration file')
  console.log('   2. Or apply migrations manually via Supabase Dashboard\n')

  // For now, just check which tables should exist
  const tableMigrations: Record<string, string[]> = {}

  for (const file of migrationFiles) {
    const filePath = join(migrationsDir, file)
    const sql = readFileSync(filePath, 'utf-8')

    // Extract CREATE TABLE statements
    const createTableRegex = /CREATE TABLE (?:IF NOT EXISTS )?public\.(\w+)/gi
    let match
    while ((match = createTableRegex.exec(sql)) !== null) {
      const tableName = match[1]
      if (!tableMigrations[tableName]) {
        tableMigrations[tableName] = []
      }
      tableMigrations[tableName].push(file)
    }
  }

  console.log('📊 Tables created by migrations:\n')
  for (const [table, migrations] of Object.entries(tableMigrations)) {
    console.log(`   ${table}:`)
    migrations.forEach((migration) => console.log(`      - ${migration}`))
  }
  console.log()

  // Now try to check existing tables
  try {
    const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

    if (!databaseUrl) {
      console.log('⚠️  DATABASE_URL not set, cannot check existing tables\n')
      return
    }

    const client = new Client({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    })

    await client.connect()
    console.log('📡 Connected to database\n')

    // Get existing tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)

    const existingTables = result.rows.map((row) => row.table_name)
    console.log(`✅ Found ${existingTables.length} existing tables:\n`)
    existingTables.forEach((table) => console.log(`   - ${table}`))
    console.log()

    // Find missing tables
    const allTablesFromMigrations = Object.keys(tableMigrations)
    const missingTables = allTablesFromMigrations.filter(
      (table) => !existingTables.includes(table)
    )

    if (missingTables.length === 0) {
      console.log('✅ All tables from migrations exist!\n')
    } else {
      console.log(`⚠️  Found ${missingTables.length} missing tables:\n`)
      missingTables.forEach((table) => {
        console.log(`   - ${table}`)
        const migrations = tableMigrations[table]
        if (migrations.length > 0) {
          console.log(`     Created by: ${migrations.join(', ')}`)
        }
      })
      console.log()
    }

    await client.end()

  } catch (error: any) {
    console.error('❌ Error checking tables:', error.message)
    console.log('\n💡 Please check your DATABASE_URL in .env file\n')
  }
}

main()
  .then(() => {
    console.log('🎉 Check completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Check failed:', error)
    process.exit(1)
  })

