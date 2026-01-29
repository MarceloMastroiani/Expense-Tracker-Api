import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
        amount: Number(amount),
        type: type,
        userId: 'test',
        categoryId: 1,
        deletedAt: null,
      },
    });

    return {
      data: { ...newExpense, amount: newExpense.amount.toNumber() },
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
    return {
      data: expenses.map((expense) => {
        return { ...expense, amount: expense.amount.toNumber() };
      }),
    };
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
    return {
      data: expenses.map((expense) => {
        return { ...expense, amount: expense.amount.toNumber() };
      }),
    };
  }

  // ======== READ ONE ======== //
  async findOneExpense(id: string) {
    const expenses = await this.expense.findUnique({
      where: {
        id: id,
      },
    });
    return {
      data: expenses
        ? {
            ...expenses,
            amount: expenses.amount.toNumber(),
          }
        : null,
    };
  }

  // ======== UPDATE ======== //
  async updateExpense(id: string, updateExpenseDto: UpdateExpenseDto) {
    const updatedExpense = await this.expense.update({
      where: {
        id: id,
      },
      data: {
        ...updateExpenseDto,
      },
    });
    return {
      data: {
        ...updatedExpense,
        amount: updatedExpense.amount.toNumber(),
      },
      message: 'Expense updated successfully',
    };
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
