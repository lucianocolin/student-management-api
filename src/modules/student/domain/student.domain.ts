export class Student {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  collegeId: number;
  // TODO: add career domain
  career: string;
  // TODO: add subject domain
  subjects: string[];
  // TODO: add qualification domain
  qualifications?: number[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
