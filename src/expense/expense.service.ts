import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseRepository } from './expense.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateExpenseDto } from './dto';
// import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  // CREATE EXPENSE
  create(userId: string, createExpenseDto: CreateExpenseDto) {
    return this.expenseRepository.createExpense(userId, createExpenseDto);
  }

  // GET ALL EXPENSES
  findAll() {
    return this.expenseRepository.findAllExpenses();
  }

  // GET ALL SOFT DELETED EXPENSES | VALIDATE IF EXISTS
  async findAllSoftDeleted() {
    const getAllSoftDeleted =
      await this.expenseRepository.findAllSoftDeletedExpenses();

    if (getAllSoftDeleted.data.length === 0) {
      throw new HttpException('No expenses found', HttpStatus.NOT_FOUND);
    }

    return getAllSoftDeleted;
  }

  // GET ONE EXPENSE
  async findOne(id: string) {
    return await this.expenseRepository.findOneExpense(id);
  }

  // UPDATE EXPENSE | VALIDATE ID | VALIDATE DATA DTO
  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const validateExpenseId = await this.findOne(id);

    if (validateExpenseId.data === null) {
      throw new HttpException('Expense not found', HttpStatus.NOT_FOUND);
    }

    if (Object.keys(updateExpenseDto).length === 0) {
      throw new HttpException('No data to update', HttpStatus.BAD_REQUEST);
    }

    const updateExpense = await this.expenseRepository.updateExpense(
      id,
      updateExpenseDto,
    );

    return updateExpense;
  }

  // SOFT DELETE EXPENSE
  remove(id: string) {
    return this.expenseRepository.removeUpdateExpense(id);
  }
}
