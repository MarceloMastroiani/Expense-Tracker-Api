import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, ExpenseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
