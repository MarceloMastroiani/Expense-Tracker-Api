import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ExpenseRepository extends PrismaService {
  // ======== CREATE ======== //
  async createExpense(userId: string, createExpenseDto: CreateExpenseDto) {
    const { title, amount, type, categoryId } = createExpenseDto;

    const userExists = await this.user.findUnique({
      where: {
        id: userId,
      },
    });

    const categoryExists = await this.category.findUnique({
      where: {
        id: categoryId,
        userId: userId,
      },
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!categoryExists) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const newExpense = await this.expense.create({
      data: {
        title: title,
        amount: Number(amount),
        type: type,
        deletedAt: null,
        userId: userId,
        categoryId: categoryId,
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
    const { id: __, ...data } = updateExpenseDto;

    // await this.findOneExpense(id);

    const updatedExpense = await this.expense.update({
      where: { id },
      data: data,
    });

    return {
      data: { ...updatedExpense, amount: updatedExpense.amount.toNumber() },
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
