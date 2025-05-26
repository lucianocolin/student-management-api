import { BadRequestException } from '@nestjs/common';

export class CareerAlreadyExistsException extends BadRequestException {
  constructor(name: string) {
    super(`Career with name ${name} already exists`);
  }
}
