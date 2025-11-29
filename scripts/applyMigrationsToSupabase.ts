/**
 * Apply all SQL migrations to Supabase using service role key
 * Reads .env but does not modify it
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { Client } from 'pg'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

// .env dosyasını yükle (proje kök dizininden)
config({ path: resolve(process.cwd(), '.env') })

async function applyMigrations() {
  console.log('🚀 Applying SQL migrations to Supabase...\n')

  // .env'den DATABASE_URL veya DIRECT_URL al (değiştirme, sadece oku)
  // DIRECT_URL pgbouncer olmadan direkt bağlantı için daha uygun
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error('DATABASE_URL or DIRECT_URL environment variable is not set. Please check your .env file.')
  }

  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    throw new Error('DATABASE_URL/DIRECT_URL must start with postgresql:// or postgres://')
  }

  console.log(`📡 Connecting to database...`)
  console.log(`   Using: ${process.env.DIRECT_URL ? 'DIRECT_URL' : 'DATABASE_URL'}`)
  console.log(`   Host: ${databaseUrl.split('@')[1]?.split('/')[0] || 'unknown'}\n`)

  // PostgreSQL client oluştur
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false, // Supabase için gerekli
    },
  })

  try {
    await client.connect()
    console.log('✅ Connected to database\n')

    // Migration dosyalarını oku
    const migrationsDir = join(process.cwd(), 'supabase', 'migrations')
    const files = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort() // Numaralı sırayla

    console.log(`📁 Found ${files.length} migration files\n`)

    let successCount = 0
    let errorCount = 0

    for (const file of files) {
      const filePath = join(migrationsDir, file)
      const sql = readFileSync(filePath, 'utf-8')

      console.log(`📝 Applying: ${file}...`)

      try {
        // SQL'i çalıştır
        await client.query(sql)
        console.log(`   ✅ Success: ${file}\n`)
        successCount++
      } catch (error: any) {
        // Bazı hatalar normal olabilir (örn: tablo zaten varsa)
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key') ||
            error.message.includes('relation') && error.message.includes('already exists')) {
          console.log(`   ⚠️  Skipped (already exists): ${file}\n`)
          successCount++
        } else {
          console.error(`   ❌ Error: ${error.message}\n`)
          errorCount++
        }
      }
    }

    console.log('\n📊 Summary:')
    console.log(`   ✅ Success: ${successCount}`)
    console.log(`   ❌ Errors: ${errorCount}`)
    console.log(`   📁 Total: ${files.length}`)

    if (errorCount === 0) {
      console.log('\n🎉 All migrations applied successfully!')
    } else {
      console.log('\n⚠️  Some migrations had errors. Please check the output above.')
    }
  } catch (error: any) {
    console.error('❌ Connection error:', error.message)
    throw error
  } finally {
    await client.end()
    console.log('\n🔌 Disconnected from database')
  }
}

applyMigrations().catch((error) => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})

