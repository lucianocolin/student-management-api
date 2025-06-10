import { NotFoundException } from '@nestjs/common';

export class EnrollmentNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Enrollment with id ${id} not found`);
  }
}
