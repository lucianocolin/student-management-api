import { BadRequestException } from '@nestjs/common';

export class StudentNotFoundException extends BadRequestException {
  constructor(id: string) {
    super(`Student with id ${id} not found`);
  }
}
