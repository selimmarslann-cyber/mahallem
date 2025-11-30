import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env file manually to ensure DATABASE_URL is loaded before Prisma Client initialization
if (typeof window === 'undefined') {
  // Load .env from project root - this MUST happen before any Prisma Client usage
  // CRITICAL: Use override: true to override system environment variables
  const envPath = resolve(process.cwd(), '.env')
  const result = config({ path: envPath, override: true })
  
  // Debug: Log if .env was loaded
  if (process.env.NODE_ENV === 'development') {
    if (result.error) {
      console.warn('⚠️  dotenv config error:', result.error.message)
    } else {
      console.log('✅ dotenv loaded .env from:', envPath)
      console.log('✅ dotenv override: true (system env vars will be overridden)')
    }
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization function to ensure DATABASE_URL is loaded correctly
function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  // CRITICAL: Log DATABASE_URL BEFORE validation to see what we're actually getting
  console.log('🔍 Prisma DEBUG DATABASE_URL from process.env:', process.env.DATABASE_URL)
  
  // Get DATABASE_URL from environment (now loaded via dotenv)
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set in environment variables. Please check your .env file.')
  }

  if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
    console.error('❌ DATABASE_URL format error!')
    console.error('❌ Current value:', databaseUrl)
    console.error('❌ Expected format: postgresql://... or postgres://...')
    throw new Error(
      `DATABASE_URL must start with postgresql:// or postgres://. Current value: ${databaseUrl.substring(0, 50)}...`
    )
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }

  return prisma
}

// Export a getter function instead of direct instance
export const prisma = getPrismaClient()

