import { NotFoundException } from '@nestjs/common';

export class SubjectNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Subject with id ${id} not found`);
  }
}
