import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
});

// Session utilities
const COOKIE_NAME = 'auth_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Helper function to generate a secure random token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId: string) {
  // Create a new session
  const expiresAt = new Date(Date.now() + MAX_AGE * 1000);
  const token = generateToken();
  
  const session = await prisma.session.create({
    data: {
      userId,
      expiresAt,
      token,
    },
  });

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: session.id,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    sameSite: 'lax',
  });

  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } });
    }
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  
  if (sessionId) {
    try {
      await prisma.session.delete({ where: { id: sessionId } });
    } catch (error) {
      console.error('Error deleting session:', error);
      // Continue with cookie deletion even if session deletion fails
    }
  }
  
  // Explicitly set cookie with expired date to ensure it's removed
  cookieStore.set({
    name: COOKIE_NAME,
    value: '',
    expires: new Date(0), // Set to epoch time to ensure immediate expiration
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  // Also use the delete method as a fallback
  cookieStore.delete(COOKIE_NAME);
}

// Authentication functions
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, password: string, username?: string) {
  const hashedPassword = await hashPassword(password);
  
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  return prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      username,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return user;
}