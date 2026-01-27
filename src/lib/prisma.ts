import { PrismaClient } from '@prisma/client';

// Crear una instancia singleton de Prisma para evitar múltiples conexiones en desarrollo
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'], // Log solo de errores en desarrollo
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
