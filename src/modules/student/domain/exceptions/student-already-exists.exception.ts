import { BadRequestException } from '@nestjs/common';

export class StudentAlreadyExistsException extends BadRequestException {
  constructor(email: string) {
    super(`Student with email ${email} already exists`);
  }
}
