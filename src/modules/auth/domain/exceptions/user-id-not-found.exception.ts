import { NotFoundException } from '@nestjs/common';

export class UserIdNotFoundException extends NotFoundException {
  constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}
