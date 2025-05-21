import { BadRequestException } from '@nestjs/common';

export class UserNotFoundException extends BadRequestException {
  constructor(email: string) {
    super(`User with email ${email} not found`);
  }
}
