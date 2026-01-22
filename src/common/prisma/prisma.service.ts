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
    const adapter = new PrismaPg({ url: envs.databaseUrl });
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
