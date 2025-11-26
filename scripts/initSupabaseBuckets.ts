/**
 * Supabase Storage Bucket'ları Oluşturma Script'i
 * 
 * Bu script, Supabase Storage'da gerekli bucket'ları oluşturur.
 * NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY kullanır.
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

import { createClient } from '@supabase/supabase-js'

async function initSupabaseBuckets() {
  // Ortam değişkenleri kontrolü
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    console.error('❌ HATA: NEXT_PUBLIC_SUPABASE_URL environment değişkeni tanımlı değil!')
    console.error('   Lütfen .env.local dosyasında NEXT_PUBLIC_SUPABASE_URL değişkenini ayarlayın.')
    process.exit(1)
  }

  if (!serviceRoleKey) {
    console.error('❌ HATA: SUPABASE_SERVICE_ROLE_KEY environment değişkeni tanımlı değil!')
    console.error('   Lütfen .env.local dosyasında SUPABASE_SERVICE_ROLE_KEY değişkenini ayarlayın.')
    process.exit(1)
  }

  console.log('🔄 Supabase Storage bucket\'ları kontrol ediliyor...')
  console.log(`   Supabase URL: ${supabaseUrl}`)

  // Supabase Admin Client oluştur
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  try {
    // Mevcut bucket'ları listele
    const { data: existingBuckets, error: listError } = await supabaseAdmin.storage.listBuckets()

    if (listError) {
      throw new Error(`Bucket listesi alınamadı: ${listError.message}`)
    }

    const bucketNames = existingBuckets?.map(b => b.name) || []
    console.log(`\n📦 Mevcut bucket'lar: ${bucketNames.length > 0 ? bucketNames.join(', ') : '(yok)'}`)

    // Oluşturulacak bucket'lar
    const bucketsToCreate = [
      {
        name: 'posts',
        public: true,
        fileSizeLimit: 5242880, // 5 MB
        allowedMimeTypes: ['image/*'],
      },
      {
        name: 'avatars',
        public: true,
        fileSizeLimit: 2097152, // 2 MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      },
    ]

    const createdBuckets: string[] = []
    const existingBucketsList: string[] = []

    for (const bucketConfig of bucketsToCreate) {
      const bucketName = bucketConfig.name

      // Bucket zaten var mı kontrol et
      if (bucketNames.includes(bucketName)) {
        console.log(`\n✓ "${bucketName}" bucket'ı zaten mevcut, atlanıyor...`)
        existingBucketsList.push(bucketName)
        continue
      }

      // Bucket oluştur
      console.log(`\n📦 "${bucketName}" bucket'ı oluşturuluyor...`)
      
      const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: bucketConfig.public,
        fileSizeLimit: bucketConfig.fileSizeLimit,
        allowedMimeTypes: bucketConfig.allowedMimeTypes,
      })

      if (error) {
        // Bucket zaten varsa (race condition)
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`   ⚠️  "${bucketName}" bucket'ı zaten mevcut (başka bir işlem tarafından oluşturulmuş olabilir)`)
          existingBucketsList.push(bucketName)
        } else {
          throw new Error(`"${bucketName}" bucket'ı oluşturulamadı: ${error.message}`)
        }
      } else {
        console.log(`   ✅ "${bucketName}" bucket'ı başarıyla oluşturuldu`)
        createdBuckets.push(bucketName)
      }
    }

    // Özet
    console.log('\n' + '='.repeat(50))
    console.log('📊 ÖZET:')
    if (createdBuckets.length > 0) {
      console.log(`   ✅ Oluşturulan bucket'lar: ${createdBuckets.join(', ')}`)
    }
    if (existingBucketsList.length > 0) {
      console.log(`   ℹ️  Zaten mevcut bucket'lar: ${existingBucketsList.join(', ')}`)
    }
    console.log('='.repeat(50))

    // RLS Policy'leri oluştur (opsiyonel - manuel yapılabilir)
    console.log('\n💡 NOT: RLS (Row Level Security) politikaları manuel olarak ayarlanmalıdır.')
    console.log('   Detaylar için: supabase/README_ENV_SETUP.md')

    console.log('\n✅ Supabase Storage bucket\'ları hazır!')
  } catch (error: any) {
    console.error('\n❌ Bucket oluşturulurken hata oluştu:')
    console.error(error.message)
    if (error.stack) {
      console.error('\nStack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Script doğrudan çalıştırılıyorsa
if (require.main === module) {
  initSupabaseBuckets()
    .then(() => {
      console.log('\n🎉 Tamamlandı!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Kritik hata:', error)
      process.exit(1)
    })
}

export { initSupabaseBuckets }

