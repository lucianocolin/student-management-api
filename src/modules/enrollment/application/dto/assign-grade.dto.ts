import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';

export class AssignGradeDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(10)
  grade: number;
}
