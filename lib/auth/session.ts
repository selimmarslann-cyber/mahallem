import { cookies } from 'next/headers'
import { verifyToken, JWTPayload } from './jwt'

/**
 * Server-side session kontrolü
 * Middleware veya server component'lerde kullanılır
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

/**
 * Kullanıcı ID'sini döndür
 */
export async function getUserId(): Promise<string | null> {
  const session = await getSession()
  return session?.userId || null
}

/**
 * Kullanıcı giriş yapmış mı kontrol et
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

