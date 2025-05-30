import { User } from 'src/modules/auth/domain/user.domain';
import { CreateStudentDto } from '../../application/dto/create-student.dto';
import { StudentResponseDto } from '../../application/dto/student-response.dto';

export const STUDENT_SERVICE_KEY = 'STUDENT_SERVICE';

export interface IStudentService {
  getAll(): Promise<StudentResponseDto[]>;
  getOneById(id: string): Promise<StudentResponseDto>;
  create(
    createStudentDto: CreateStudentDto,
    user: User,
  ): Promise<StudentResponseDto>;
  delete(id: string): Promise<void>;
}
