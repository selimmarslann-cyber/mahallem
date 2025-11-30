/**
 * Check existing tables in Supabase and create missing ones
 * Uses DATABASE_URL from .env to connect directly to PostgreSQL
 */

import { config } from 'dotenv'
import { Client } from 'pg'
import { join } from 'path'

// Load .env file
config({ path: join(process.cwd(), '.env') })

// Expected tables from Prisma schema
const EXPECTED_TABLES = [
  'users',
  'businesses',
  'products',
  'orders',
  'order_items',
  'payments',
  'reviews',
  'messages',
  'business_bans',
  'referral_codes',
  'referral_relations',
  'referral_rewards',
  'jobs',
  'instant_jobs',
  'instant_job_offers',
  'job_offers',
  'wallets',
  'payout_requests',
  'notifications',
  'push_tokens',
  'otps',
  'delivery_reminders',
  'job_notifications',
  'support_tickets',
  'support_messages',
  // Referral commission system tables
  'region_managers',
  'wallet_transactions',
  'referral_payouts',
]

async function checkAndCreateTables() {
  console.log('🔍 Checking existing tables in Supabase...\n')

  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  console.log('📡 Connecting to database...')

  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    // Get existing tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)

    const existingTables = result.rows.map((row) => row.table_name)
    console.log(`📋 Found ${existingTables.length} existing tables:`)
    existingTables.forEach((table) => console.log(`   - ${table}`))
    console.log()

    // Find missing tables
    const missingTables = EXPECTED_TABLES.filter(
      (table) => !existingTables.includes(table)
    )

    if (missingTables.length === 0) {
      console.log('✅ All expected tables exist!\n')
      return
    }

    console.log(`⚠️  Found ${missingTables.length} missing tables:`)
    missingTables.forEach((table) => console.log(`   - ${table}`))
    console.log()

    // Check which migration files might create these tables
    console.log('📝 Checking migration files...\n')

    const { readdirSync, readFileSync } = await import('fs')
    const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
    const migrationFiles = readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort()

    console.log(`📁 Found ${migrationFiles.length} migration files\n`)

    // For each missing table, try to find which migration creates it
    const tablesToCreate: { table: string; migration?: string }[] = []

    for (const table of missingTables) {
      let foundMigration: string | undefined

      for (const file of migrationFiles) {
        const filePath = join(migrationsDir, file)
        const sql = readFileSync(filePath, 'utf-8')

        // Check if this migration creates the table
        const createTableRegex = new RegExp(
          `CREATE TABLE (?:IF NOT EXISTS )?public\\.${table}`,
          'i'
        )
        if (createTableRegex.test(sql)) {
          foundMigration = file
          break
        }
      }

      tablesToCreate.push({ table, migration: foundMigration })
    }

    console.log('📊 Missing tables analysis:\n')
    tablesToCreate.forEach(({ table, migration }) => {
      if (migration) {
        console.log(`   ✅ ${table} → ${migration}`)
      } else {
        console.log(`   ⚠️  ${table} → No migration found (might be created by Prisma)`)
      }
    })
    console.log()

    // Ask user if they want to run migrations
    console.log('💡 Recommendation:')
    console.log('   Run missing migrations manually in Supabase SQL Editor\n')
    console.log('   Or, if you want to create tables directly, I can help with that.\n')

  } catch (error: any) {
    console.error('❌ Error:', error.message)
    throw error
  } finally {
    await client.end()
    console.log('🔌 Database connection closed\n')
  }
}

checkAndCreateTables()
  .then(() => {
    console.log('🎉 Check completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Check failed:', error)
    process.exit(1)
  })

