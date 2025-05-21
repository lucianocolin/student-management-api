import { BadRequestException } from '@nestjs/common';
import { USER_ROLES } from '../../application/enum/user-roles.enum';

export class InvalidRoleException extends BadRequestException {
  constructor(email: string, validRoles: USER_ROLES[]) {
    super(`User with email ${email} does not have a valid role: ${validRoles}`);
  }
}
