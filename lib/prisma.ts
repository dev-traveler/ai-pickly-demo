import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Database health check utility
 * @returns Object with health status
 */
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { healthy: true };
  } catch (error) {
    console.error("Database health check failed:", error);
    return { healthy: false, error };
  }
}
