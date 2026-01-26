import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseRepository } from './expense.repository';
// import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly expenseRepository: ExpenseRepository) {}

  create(createExpenseDto: CreateExpenseDto) {
    return this.expenseRepository.createExpense(createExpenseDto);
  }

  findAll() {
    return this.expenseRepository.findAllExpenses();
  }

  findAllSoftDeleted() {
    return this.expenseRepository.findAllSoftDeletedExpenses();
  }

  findOne(id: string) {
    return this.expenseRepository.findOneExpense(id);
  }

  update(id: string, updateExpenseDto: any) {
    return this.expenseRepository.updateExpense(id, updateExpenseDto);
  }

  remove(id: string) {
    return this.expenseRepository.removeUpdateExpense(id);
  }
}
