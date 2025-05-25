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

@Injectable()
export class StudentService implements IStudentService {
  constructor(
    @Inject(STUDENT_REPOSITORY_KEY)
    private readonly studentRepository: IStudentRepository,
    private readonly studentMapper: StudentMapper,
  ) {}

  async getAll(): Promise<StudentResponseDto[]> {
    try {
      const dbStudents = await this.studentRepository.getAll();

      return dbStudents.map((student) =>
        this.studentMapper.fromStudentToStudentResponseDto(student),
      );
    } catch (error) {
      console.log('error: ', error);
    }
  }

  async getOneById(id: string): Promise<StudentResponseDto> {
    const dbStudent = await this.studentRepository.findOneById(id);

    return this.studentMapper.fromStudentToStudentResponseDto(dbStudent);
  }

  async create(
    createStudentDto: CreateStudentDto,
    user: User,
  ): Promise<StudentResponseDto> {
    const dbStudent = await this.studentRepository.create({
      ...createStudentDto,
      user,
    });

    return this.studentMapper.fromStudentToStudentResponseDto(dbStudent);
  }
}
