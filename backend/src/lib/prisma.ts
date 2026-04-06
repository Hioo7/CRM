import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { AppConfig } from '../config/AppConfig';

class PrismaClientSingleton {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      const adapter = new PrismaPg({ connectionString: AppConfig.getInstance().databaseUrl });
      PrismaClientSingleton.instance = new PrismaClient({ adapter });
    }
    return PrismaClientSingleton.instance;
  }
}

export const prisma = PrismaClientSingleton.getInstance();
