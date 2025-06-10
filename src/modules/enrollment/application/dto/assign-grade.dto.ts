import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';

export class AssignGradeDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(10)
  grade: number;
}
