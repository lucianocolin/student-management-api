import { SetMetadata } from '@nestjs/common';
import { USER_ROLES } from '../application/enum/user-roles.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...roles: USER_ROLES[]) => {
  return SetMetadata(META_ROLES, roles);
};
