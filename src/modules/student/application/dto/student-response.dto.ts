import { Career } from 'src/modules/career/domain/career.domain';

export class StudentResponseDto {
  id?: string;
  userId?: string;
  fullName: string;
  email: string;
  collegeId: number;
  career: Career;
  subjects: string[];
  qualifications?: number[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  constructor(data: StudentResponseDto) {
    Object.assign(this, data);
  }
}
