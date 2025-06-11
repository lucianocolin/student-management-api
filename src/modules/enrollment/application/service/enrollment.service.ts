import {
  ENROLLMENT_REPOSITORY_KEY,
  IEnrollmentRepository,
} from './../../domain/interface/enrollment-repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { IEnrollmentService } from '../../domain/interface/enrollment-service.interface';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';
import { EnrollmentMapper } from '../mapper/enrollment.mapper';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import {
  IStudentService,
  STUDENT_SERVICE_KEY,
} from '../../../student/domain/interfaces/student-service.interface';
import {
  ISubjectService,
  SUBJECT_SERVICE_KEY,
} from '../../../subject/domain/interfaces/subject-service.interface';
import { User } from '../../../auth/domain/user.domain';
import { AssignGradeDto } from '../dto/assign-grade.dto';

@Injectable()
export class EnrollmentService implements IEnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY_KEY)
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly enrollmentMapper: EnrollmentMapper,
    @Inject(STUDENT_SERVICE_KEY)
    private readonly studentService: IStudentService,
    @Inject(SUBJECT_SERVICE_KEY)
    private readonly subjectService: ISubjectService,
  ) {}

  async getAll(studentId?: string): Promise<EnrollmentResponseDto[]> {
    const dbEnrollments = await this.enrollmentRepository.findAll(studentId);

    return dbEnrollments.map((dbEnrollment) =>
      this.enrollmentMapper.fromEnrollmentToEnrollmentResponseDto(dbEnrollment),
    );
  }

  async create(
    createEnrollmentDto: CreateEnrollmentDto,
    user: User,
  ): Promise<EnrollmentResponseDto> {
    const student = await this.studentService.getOneById(user.studentId);
    const subject = await this.subjectService.getOneById(
      createEnrollmentDto.subjectId,
    );

    const dbEnrollment = await this.enrollmentRepository.create({
      ...createEnrollmentDto,
      studentId: user.studentId,
      student,
      subject,
    });

    return this.enrollmentMapper.fromEnrollmentToEnrollmentResponseDto(
      dbEnrollment,
    );
  }

  async assignGrade(
    enrollmentId: string,
    assignGradeDto: AssignGradeDto,
  ): Promise<EnrollmentResponseDto> {
    const dbEnrollmentUpdated = await this.enrollmentRepository.updateOne(
      enrollmentId,
      {
        ...assignGradeDto,
        approved: assignGradeDto.grade >= 6,
      },
    );

    return this.enrollmentMapper.fromEnrollmentToEnrollmentResponseDto(
      dbEnrollmentUpdated,
    );
  }
}
