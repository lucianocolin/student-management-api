import { Enrollment } from '../enrollment.domain';

export const ENROLLMENT_REPOSITORY_KEY = 'ENROLLMENT_REPOSITORY';

export interface IEnrollmentRepository {
  findAll(studentId?: string): Promise<Enrollment[]>;
  create(enrollment: Enrollment): Promise<Enrollment>;
}
