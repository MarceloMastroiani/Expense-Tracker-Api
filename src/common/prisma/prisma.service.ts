import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { envs } from 'src/common/configs/envs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: envs.databaseUrl,
    });
    super({ adapter });
  }

  onModuleInit() {
    this.$connect();
    Logger.log('Database connected');
  }
  onModuleDestroy() {
    this.$disconnect();
    Logger.log('Database disconnected');
  }
}

/* 
// Crear el Pool de PostgreSQL
    const pool = new Pool({
      connectionString: envs.databaseUrl,
    });

    // Pasar el pool al adaptador (no un objeto con url)
    const adapter = new PrismaPg(pool);

    super({ adapter }); 
    */
