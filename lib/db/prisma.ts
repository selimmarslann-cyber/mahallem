import { PrismaClient } from '@prisma/client'
import { validateDatabaseUrl } from './validateDatabaseUrl'

// Validate DATABASE_URL on import
if (typeof window === 'undefined') {
  // Only validate on server-side
  try {
    validateDatabaseUrl()
  } catch (error: any) {
    console.error('❌ DATABASE_URL validation failed:', error.message)
    console.error('📝 Please check your .env or .env.local file')
    console.error('📖 See DATABASE_URL_FIX.md for instructions')
    // Don't throw - let Prisma handle it with a better error message
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

