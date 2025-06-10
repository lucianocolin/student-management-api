import { Enrollment } from '../enrollment.domain';

export const ENROLLMENT_REPOSITORY_KEY = 'ENROLLMENT_REPOSITORY';

export interface IEnrollmentRepository {
  findAll(studentId?: string): Promise<Enrollment[]>;
  findOneById(id: string): Promise<Enrollment>;
  create(enrollment: Enrollment): Promise<Enrollment>;
  updateOne(id: string, enrollment: Partial<Enrollment>): Promise<Enrollment>;
}
