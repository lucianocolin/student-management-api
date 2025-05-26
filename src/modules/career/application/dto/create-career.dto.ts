import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
