import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { TaskType } from 'generated/prisma/enums';
import { TaskTypeList } from '../enums/tasktype.enum';

export class CreateExpenseDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount: number;

  @IsEnum(TaskTypeList, {
    message: `Valid status are ${TaskTypeList}`,
  })
  type: TaskType;

  @IsOptional()
  deletedAt?: null;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}

//PARA USERS:
// @IsArray({ message: 'expenses must be an array' })
// @ArrayMinSize(1, { message: 'At least one expense is required' })
// @ValidateNested({ each: true })
// @Type(() => ExpensesItemDto)
// expenses: ExpensesItemDto[];
