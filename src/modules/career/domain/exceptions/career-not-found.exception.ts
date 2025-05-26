import { NotFoundException } from '@nestjs/common';

export class CareerNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`Career with id ${id} not found`);
  }
}
