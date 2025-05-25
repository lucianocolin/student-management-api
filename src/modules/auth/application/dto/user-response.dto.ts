import { USER_ROLES } from '../enum/user-roles.enum';

export class UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  roles: USER_ROLES[];
  token?: string;
  studentId?: string;
  constructor(data: UserResponseDto) {
    Object.assign(this, data);
  }
}
