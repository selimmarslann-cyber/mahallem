import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
// TODO: İleride Supabase Auth kullanılacak
// import { createClient } from '@supabase/supabase-js'

/**
 * Basit email/password auth
 * TODO: İleride Supabase Auth'a geçilecek
 */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(data: {
  email: string
  password: string
  name: string
  instantJobNotifications?: boolean
}) {
  const passwordHash = await hashPassword(data.password)

  return prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      instantJobNotifications: data.instantJobNotifications ?? false,
    },
  })
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function verifyUser(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user || !user.passwordHash) {
    return null
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  if (!isValid) {
    return null
  }

  return user
}

