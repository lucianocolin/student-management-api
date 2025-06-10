import { User } from 'src/modules/auth/domain/user.domain';
import { CreateEnrollmentDto } from '../../application/dto/create-enrollment.dto';
import { EnrollmentResponseDto } from '../../application/dto/enrollment-response.dto';
import { AssignGradeDto } from '../../application/dto/assign-grade.dto';

export const ENROLLMENT_SERVICE_KEY = 'ENROLLMENT_SERVICE';

export interface IEnrollmentService {
  getAll(studentId?: string): Promise<EnrollmentResponseDto[]>;
  create(
    createEnrollmentDto: CreateEnrollmentDto,
    user: User,
  ): Promise<EnrollmentResponseDto>;
  assignGrade(
    enrollmentId: string,
    assignGradeDto: AssignGradeDto,
  ): Promise<EnrollmentResponseDto>;
}
