import { User } from 'src/modules/auth/domain/user.domain';

export class Student {
  id?: string;
  fullName: string;
  email: string;
  collegeId: number;
  // TODO: add career domain
  career: string;
  // TODO: add subject domain
  subjects: string[];
  // TODO: add qualification domain
  qualifications?: number[];
  user: User;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
