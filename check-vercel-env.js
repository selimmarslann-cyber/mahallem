/**
 * Vercel Environment Variables Kontrol Scripti
 * 
 * Bu script, Vercel projenizdeki mevcut environment variable'ları kontrol eder
 * ve eksik olanları listeler.
 */

const requiredEnvVars = {
  // KRİTİK (Zorunlu)
  critical: [
    { name: 'DATABASE_URL', description: 'PostgreSQL veritabanı bağlantı URL\'i' },
    { name: 'JWT_SECRET', description: 'JWT token imzalama secret key (min 32 karakter)' },
    { name: 'NEXT_PUBLIC_APP_URL', description: 'Production uygulama URL\'i' },
  ],
  
  // ÖNEMLİ (Özellikler için)
  important: [
    { name: 'MAIL_HOST', description: 'SMTP sunucu adresi (örn: smtp.zoho.com)' },
    { name: 'MAIL_PORT', description: 'SMTP port (örn: 587)' },
    { name: 'MAIL_SECURE', description: 'SSL/TLS kullanımı (true/false)' },
    { name: 'MAIL_USER', description: 'SMTP kullanıcı adı (email)' },
    { name: 'MAIL_PASS', description: 'SMTP şifresi' },
    { name: 'MAIL_FROM', description: 'Gönderen email adresi (opsiyonel)' },
  ],
  
  // OPSİYONEL
  optional: [
    { name: 'DIRECT_URL', description: 'Prisma migration için direct DB URL' },
    { name: 'NEXT_PUBLIC_SUPABASE_URL', description: 'Supabase proje URL\'i' },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', description: 'Supabase anonymous key' },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', description: 'Supabase service role key' },
  ]
}

console.log('\n📋 VERCEL ENVIRONMENT VARIABLES KONTROL LİSTESİ\n')
console.log('═'.repeat(60))

console.log('\n🔴 KRİTİK (Zorunlu - Kayıt işlemi için):')
requiredEnvVars.critical.forEach((env, index) => {
  console.log(`   ${index + 1}. ${env.name}`)
  console.log(`      → ${env.description}`)
})

console.log('\n🟡 ÖNEMLİ (Email gönderimi için):')
requiredEnvVars.important.forEach((env, index) => {
  console.log(`   ${index + 1}. ${env.name}`)
  console.log(`      → ${env.description}`)
})

console.log('\n🟢 OPSİYONEL:')
requiredEnvVars.optional.forEach((env, index) => {
  console.log(`   ${index + 1}. ${env.name}`)
  console.log(`      → ${env.description}`)
})

console.log('\n' + '═'.repeat(60))
console.log('\n⚠️  VERCEL\'DE EKSİK OLANLAR:\n')

const existingVars = [
  'MAIL_PASS',
  'MAIL_FROM',
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

// Kritik eksikler
console.log('🔴 KRİTİK EKSİKLER:')
const criticalMissing = requiredEnvVars.critical.filter(env => !existingVars.includes(env.name))
if (criticalMissing.length === 0) {
  console.log('   ✅ Tüm kritik değişkenler mevcut')
} else {
  criticalMissing.forEach((env, index) => {
    console.log(`   ${index + 1}. ❌ ${env.name}`)
    console.log(`      ${env.description}`)
  })
}

// Önemli eksikler
console.log('\n🟡 ÖNEMLİ EKSİKLER:')
const importantMissing = requiredEnvVars.important.filter(env => !existingVars.includes(env.name))
if (importantMissing.length === 0) {
  console.log('   ✅ Tüm önemli değişkenler mevcut')
} else {
  importantMissing.forEach((env, index) => {
    console.log(`   ${index + 1}. ❌ ${env.name}`)
    console.log(`      ${env.description}`)
  })
}

console.log('\n' + '═'.repeat(60))
console.log('\n💡 VERCEL CLI İLE EKLEME KOMUTLARI:\n')

if (criticalMissing.length > 0 || importantMissing.length > 0) {
  const allMissing = [...criticalMissing, ...importantMissing]
  
  allMissing.forEach((env) => {
    console.log(`# ${env.description}`)
    console.log(`vercel env add ${env.name} production`)
    console.log('')
  })
  
  console.log('\n📝 Not: Her komuttan sonra value gireceksiniz. Komutları sırayla çalıştırın.\n')
} else {
  console.log('✅ Tüm gerekli environment variable\'lar mevcut!\n')
}

