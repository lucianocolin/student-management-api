import { BadRequestException } from '@nestjs/common';

export class SubjectAlreadyExistsException extends BadRequestException {
  constructor(name: string) {
    super(`Subject ${name} already exists`);
  }
}
