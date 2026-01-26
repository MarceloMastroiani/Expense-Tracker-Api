import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto, UpdateExpenseDto } from './dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // CREATE EXPENSE
  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  // GET ALL EXPENSES WITHOUT DELETEDAT
  @Get()
  findAll() {
    return this.expenseService.findAll();
  }

  // GET ALL EXPENSES WITH DELETEDAT
  @Get('soft-deleted')
  findAllSoftDeleted() {
    return this.expenseService.findAllSoftDeleted();
  }

  // GET ONE EXPENSE WITHOUT DELETEDAT
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.expenseService.findOne(id);
  }

  // UPDATE EXPENSE
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    const { id: _, ...rest } = updateExpenseDto;
    return this.expenseService.update(id, rest);
  }

  // DELETE EXPENSE, RETRIEVE THE DATA THAT HAS DATA IN DELETEDAT
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.expenseService.remove(id);
  }
}
