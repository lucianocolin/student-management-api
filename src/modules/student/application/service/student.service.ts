import { Inject, Injectable } from '@nestjs/common';
import { StudentResponseDto } from '../dto/student-response.dto';
import { IStudentService } from '../../domain/interfaces/student-service.interface';
import {
  IStudentRepository,
  STUDENT_REPOSITORY_KEY,
} from '../../domain/interfaces/student-repository.interface';
import { StudentMapper } from '../mapper/student.mapper';
import { CreateStudentDto } from '../dto/create-student.dto';
import { User } from 'src/modules/auth/domain/user.domain';
import {
  CAREER_SERVICE_KEY,
  ICareerService,
} from '../../../career/domain/interfaces/career-service.interface';
import { StudentNotFoundException } from '../../domain/exceptions/student-not-found.exception';
import {
  AUTH_SERVICE_KEY,
  IAuthService,
} from '../../../auth/domain/interfaces/auth-service.interface';

@Injectable()
export class StudentService implements IStudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY_KEY)
    private readonly studentRepository: IStudentRepository,
    private readonly studentMapper: StudentMapper,
    @Inject(CAREER_SERVICE_KEY)
    private readonly careerService: ICareerService,
    @Inject(AUTH_SERVICE_KEY)
    private readonly authService: IAuthService,
  ) {}

  async getAll(search?: string): Promise<StudentResponseDto[]> {
    const dbStudents = await this.studentRepository.getAll(search);

    return dbStudents.map((student) =>
      this.studentMapper.fromStudentToStudentResponseDto(student),
    );
  }

  async getOneById(id: string): Promise<StudentResponseDto> {
    const dbStudent = await this.studentRepository.findOneById(id);

    if (!dbStudent) {
      throw new StudentNotFoundException(id);
    }

    return this.studentMapper.fromStudentToStudentResponseDto(dbStudent);
  }

  async create(
    createStudentDto: CreateStudentDto,
    user: User,
  ): Promise<StudentResponseDto> {
    const career = await this.careerService.getOneById(
      createStudentDto.careerId,
    );

    const dbStudent = await this.studentRepository.create({
      ...createStudentDto,
      collegeId: (await this.getLastCollegeId()) + 1,
      user,
      career,
      subjects: career.subjects || [],
    });

    return this.studentMapper.fromStudentToStudentResponseDto(dbStudent);
  }

  async delete(id: string): Promise<void> {
    const { userId } = await this.getOneById(id);

    const isDeleted = await this.studentRepository.deleteOne(id);

    if (isDeleted) {
      await this.authService.updateUser(userId, {
        studentId: null,
      });
    }
  }

  private async getLastCollegeId(): Promise<number> {
    const students = await this.getAll();

    if (!students.length) {
      return 0;
    }

    return Math.max(...students.map((student) => student.collegeId));
  }
}
