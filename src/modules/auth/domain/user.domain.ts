import { USER_ROLES } from '../application/enum/user-roles.enum';

export class User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  roles: USER_ROLES[];
  studentId?: string;
}
