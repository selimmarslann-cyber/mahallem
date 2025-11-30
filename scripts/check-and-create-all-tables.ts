/**
 * Check existing tables and create missing ones in Supabase
 * Uses DIRECT_URL from .env for direct PostgreSQL connection
 */

import { config } from 'dotenv'
import { Client } from 'pg'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

// Load .env file - try multiple locations
const envPaths = [
  join(process.cwd(), '.env'),
  join(process.cwd(), 'mahallem-main', '.env'),
]

// Load .env without override (read-only)
for (const envPath of envPaths) {
  try {
    const result = config({ path: envPath, override: false })
    if (!result.error) {
      console.log(`📄 Loaded .env from: ${envPath}\n`)
      break
    }
  } catch (e) {
    // Continue to next path
  }
}

async function checkAndCreateTables() {
  console.log('🚀 Checking and creating missing tables in Supabase...\n')

  // Use DIRECT_URL for migrations (direct connection, no pgbouncer)
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DIRECT_URL or DATABASE_URL environment variable is not set')
    console.error('💡 Please set DIRECT_URL or DATABASE_URL in your .env file')
    console.error('   Example: DIRECT_URL=postgresql://user:pass@host:5432/db\n')
    throw new Error('DIRECT_URL or DATABASE_URL environment variable is not set')
  }

  console.log(`📡 Using database URL: ${databaseUrl.substring(0, 50)}...\n`)

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

    // Expected tables from Prisma schema and migrations
    const expectedTables = [
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

    // Find missing tables
    const missingTables = expectedTables.filter(
      (table) => !existingTables.includes(table)
    )

    if (missingTables.length === 0) {
      console.log('✅ All expected tables exist!\n')
      return
    }

    console.log(`⚠️  Found ${missingTables.length} missing tables:`)
    missingTables.forEach((table) => console.log(`   - ${table}`))
    console.log()

    // Check migration files to see which ones create these tables
    const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
    const migrationFiles = readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort()

    console.log(`📁 Found ${migrationFiles.length} migration files\n`)

    // Map tables to their migration files
    const tableToMigration: Record<string, string[]> = {}

    for (const file of migrationFiles) {
      const filePath = join(migrationsDir, file)
      const sql = readFileSync(filePath, 'utf-8')

      // Extract CREATE TABLE statements
      const createTableRegex = /CREATE TABLE (?:IF NOT EXISTS )?public\.(\w+)/gi
      let match
      while ((match = createTableRegex.exec(sql)) !== null) {
        const tableName = match[1]
        if (!tableToMigration[tableName]) {
          tableToMigration[tableName] = []
        }
        tableToMigration[tableName].push(file)
      }
    }

    // Find which migrations need to be applied
    const migrationsToApply = new Set<string>()

    for (const table of missingTables) {
      const migrations = tableToMigration[table]
      if (migrations && migrations.length > 0) {
        migrations.forEach((migration) => migrationsToApply.add(migration))
        console.log(`   ${table} → ${migrations.join(', ')}`)
      } else {
        console.log(`   ${table} → (might be created by Prisma)`)
      }
    }
    console.log()

    if (migrationsToApply.size === 0) {
      console.log('💡 Missing tables might be created by Prisma schema.\n')
      console.log('   Run: npx prisma db push\n')
      return
    }

    console.log(`📝 Found ${migrationsToApply.size} migration files to apply:\n`)
    Array.from(migrationsToApply)
      .sort()
      .forEach((file) => console.log(`   - ${file}`))
    console.log()

    // Apply migrations
    console.log('🚀 Applying migrations...\n')

    for (const file of Array.from(migrationsToApply).sort()) {
      const filePath = join(migrationsDir, file)
      const sql = readFileSync(filePath, 'utf-8')

      console.log(`📝 Applying: ${file}...`)

      try {
        // Split SQL into statements and execute them one by one
        // This helps with error handling
        const statements = sql
          .split(';')
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.startsWith('--'))

        for (const statement of statements) {
          if (statement.length > 0) {
            try {
              await client.query(statement + ';')
            } catch (err: any) {
              // Ignore "already exists" errors
              if (
                err.message.includes('already exists') ||
                err.message.includes('duplicate') ||
                err.code === '42710' || // duplicate_object
                err.code === '42P07' // duplicate_table
              ) {
                // Skip, already exists
              } else {
                console.error(`   ⚠️  Warning: ${err.message}`)
              }
            }
          }
        }

        console.log(`   ✅ Success: ${file}\n`)
      } catch (error: any) {
        console.error(`   ❌ Error: ${error.message}\n`)
        // Continue with next migration
      }
    }

    // Verify tables were created
    console.log('🔍 Verifying created tables...\n')

    const verifyResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `)

    const finalTables = verifyResult.rows.map((row) => row.table_name)
    const stillMissing = expectedTables.filter(
      (table) => !finalTables.includes(table)
    )

    if (stillMissing.length === 0) {
      console.log('✅ All expected tables now exist!\n')
    } else {
      console.log(`⚠️  Still missing ${stillMissing.length} tables:`)
      stillMissing.forEach((table) => console.log(`   - ${table}`))
      console.log('\n💡 These might need to be created by Prisma:\n')
      console.log('   Run: npx prisma db push\n')
    }

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
    console.log('🎉 Process completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Process failed:', error)
    process.exit(1)
  })

