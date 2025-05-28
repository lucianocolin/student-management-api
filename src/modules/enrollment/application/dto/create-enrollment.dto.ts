import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsNumber()
  @IsOptional()
  grade?: number;

  @IsBoolean()
  @IsOptional()
  approved?: boolean;
}
