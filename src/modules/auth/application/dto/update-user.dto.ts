import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @IsString()
  @IsOptional()
  studentId?: string;
}
