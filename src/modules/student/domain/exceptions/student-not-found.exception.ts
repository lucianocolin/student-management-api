import { NotFoundException } from '@nestjs/common';

export class StudentNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Student with id ${id} not found`);
  }
}
