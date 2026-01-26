import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
