import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()



export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('🚀 Connected to PostgreSQL database!')
  } catch (err) {
    console.error('❌ Failed to connect to database:', err)
  }
}
