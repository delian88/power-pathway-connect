import { SignJWT, jwtVerify } from 'jose';
import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server';

const secretKey = process.env.JWT_SECRET || 'supersecret_jwt_key_123!';
const key = new TextEncoder().encode(secretKey);

export async function createSession(userId: string, email: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);

  setCookie('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function verifySession() {
  const sessionCookie = getCookie('admin_session');
  if (!sessionCookie) return null;

  try {
    const { payload } = await jwtVerify(sessionCookie, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export function destroySession() {
  deleteCookie('admin_session');
}
