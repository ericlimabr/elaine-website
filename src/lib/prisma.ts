import "server-only"
import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL

  if (!dbUrl) {
    throw new Error(
      "CRITICAL ERROR: DATABASE_URL was not found in process.env!",
    )
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export { prisma }

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
