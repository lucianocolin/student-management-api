import { User } from 'src/modules/auth/domain/user.domain';
import { Career } from 'src/modules/career/domain/career.domain';

export class Student {
  id?: string;
  fullName: string;
  email: string;
  collegeId: number;
  career: Career;
  // TODO: add subject domain
  subjects?: string[] | null;
  // TODO: add qualification domain
  qualifications?: number[];
  user: User;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
