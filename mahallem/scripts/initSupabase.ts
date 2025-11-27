/**
 * Supabase Master Initialization Script
 * 
 * Bu script, Supabase kurulumunu tek seferde yapar:
 * 1. SQL şemasını uygular (DATABASE_URL üzerinden)
 * 2. Storage bucket'larını oluşturur (posts, avatars)
 * 
 * Kullanım: npm run supabase:init
 */

// .env.local dosyasını yükle (önce .env.local, sonra .env)
import { config } from 'dotenv'
import { resolve } from 'path'
import { existsSync } from 'fs'

// Önce .env.local'i yükle (daha yüksek öncelik)
const envLocalPath = resolve(process.cwd(), '.env.local')
const envPath = resolve(process.cwd(), '.env')

// .env.local varsa onu yükle (override: true ile mevcut değerleri ezecek)
if (existsSync(envLocalPath)) {
  const result = config({ path: envLocalPath, override: true })
  if (result.error) {
    console.warn('⚠️  .env.local yüklenirken hata:', result.error.message)
  }
} else {
  console.warn('⚠️  .env.local dosyası bulunamadı!')
}

// .env dosyasını yükle (override: false = .env.local öncelikli)
if (existsSync(envPath)) {
  config({ path: envPath, override: false })
}

import { applySupabaseSchema } from './applySupabaseSchema'
import { initSupabaseBuckets } from './initSupabaseBuckets'

async function initSupabase() {
  console.log('🚀 Supabase Kurulum Başlatılıyor...\n')
  console.log('='.repeat(60))

  // Ortam değişkenleri kontrolü
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('❌ HATA: Aşağıdaki environment değişkenleri tanımlı değil:')
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`)
    })
    console.error('\n   Lütfen .env.local dosyasında bu değişkenleri ayarlayın.')
    console.error('   Örnek için: .env.example dosyasına bakın.')
    process.exit(1)
  }

  console.log('✅ Tüm gerekli environment değişkenleri mevcut\n')

  try {
    // 0. Prisma Schema'yı Uygula (önce tablolar oluşturulmalı)
    console.log('📋 ADIM 0: Prisma Schema Uygulanıyor (Tablolar)')
    console.log('-'.repeat(60))
    console.log('   ℹ️  Prisma schema uygulanıyor...')
    console.log('   💡 Eğer tablolar zaten varsa bu adım atlanabilir.')
    console.log('   Komut: npm run db:push')
    console.log('   ⚠️  Bu script sadece SQL migration\'larını çalıştırır.')
    console.log('   Prisma schema\'yı manuel olarak uygulamanız gerekebilir.')
    console.log('')

    // 1. SQL Şemasını Uygula
    console.log('📋 ADIM 1: SQL Migration\'ları Uygulanıyor')
    console.log('-'.repeat(60))
    await applySupabaseSchema()
    console.log('')

    // 2. Storage Bucket'larını Oluştur
    console.log('📦 ADIM 2: Storage Bucket\'ları Oluşturuluyor')
    console.log('-'.repeat(60))
    await initSupabaseBuckets()

    // Başarı mesajı
    console.log('\n' + '='.repeat(60))
    console.log('🎉 SUPABASE KURULUMU TAMAMLANDI!')
    console.log('='.repeat(60))
    console.log('\n✅ Yapılan işlemler:')
    console.log('   1. SQL şeması veritabanına uygulandı')
    console.log('   2. Storage bucket\'ları oluşturuldu (posts, avatars)')
    console.log('\n💡 Sonraki adımlar:')
    console.log('   - Supabase Dashboard > Storage > Policies bölümünden RLS politikalarını ayarlayın')
    console.log('   - Detaylar için: supabase/README_ENV_SETUP.md')
    console.log('')
  } catch (error: any) {
    console.error('\n' + '='.repeat(60))
    console.error('❌ KURULUM BAŞARISIZ!')
    console.error('='.repeat(60))
    console.error('\nHata:', error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Script doğrudan çalıştırılıyorsa
if (require.main === module) {
  initSupabase()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Kritik hata:', error)
      process.exit(1)
    })
}

export { initSupabase }

