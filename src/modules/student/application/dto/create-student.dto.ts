import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  collegeId: number;

  @IsString()
  @IsNotEmpty()
  careerId: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  subjects: string[];
}
