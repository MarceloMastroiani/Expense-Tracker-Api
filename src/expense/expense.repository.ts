import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto';

@Injectable()
export class ExpenseRepository extends PrismaService {
  // ======== CREATE ======== //
  async createExpense(createExpenseDto: CreateExpenseDto) {
    const { title, amount, type } = createExpenseDto;

    const newExpense = await this.expense.create({
      data: {
        title: title,
        amount: amount,
        type: type,
        userId: 'test',
        categoryId: 0,
        deletedAt: null,
      },
    });

    return {
      data: newExpense,
      message: 'Expense created successfully',
    };
  }

  // ======== READ ======== //
  async findAllExpenses() {
    const expenses = await this.expense.findMany({
      where: {
        deletedAt: null,
      },
    });
    return { data: expenses };
  }

  // ======== READ SOFT DELETED ======== //
  async findAllSoftDeletedExpenses() {
    const expenses = await this.expense.findMany({
      where: {
        deletedAt: {
          not: null,
        },
      },
    });
    return { data: expenses };
  }

  // ======== READ ONE ======== //
  async findOneExpense(id: string) {
    const expense = await this.expense.findUnique({
      where: {
        id: id,
      },
    });
    return { data: expense };
  }

  // ======== UPDATE ======== //
  async updateExpense(id: string, updateExpenseDto: UpdateExpenseDto) {
    const { id: _, ...rest } = updateExpenseDto;
    return this.expense.update({
      where: {
        id: id,
      },
      data: rest,
    });
  }

  // ======== SOFT DELETE ======== //
  async removeUpdateExpense(id: string) {
    return this.expense.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
