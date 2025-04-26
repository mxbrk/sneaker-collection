import { PrismaClient } from '@prisma/client';

// Prisma Client mit Connection Pooling konfigurieren
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Connection Pooling aktivieren für bessere Performance
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL,
      },
    },
    // Log-Level für Produktionsumgebung anpassen
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;