import { BadRequestException } from '@nestjs/common';

export class UserNotApprovedException extends BadRequestException {
  constructor(email: string) {
    super(
      `User with email ${email} hasn't been approved. Contact with an admin`,
    );
  }
}
