import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client to prevent multiple instances
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

// Export the function to get the Prisma client
export function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;