import { User } from 'src/modules/auth/domain/user.domain';
import { Career } from 'src/modules/career/domain/career.domain';
import { Subject } from 'src/modules/subject/domain/subject.domain';

export class Student {
  id?: string;
  fullName: string;
  email: string;
  collegeId: number;
  career: Career;
  subjects: Subject[];
  // TODO: add qualification domain
  qualifications?: number[];
  user: User;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
