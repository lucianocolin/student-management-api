import { Injectable } from '@nestjs/common';
import { Student } from '../../domain/student.domain';
import { StudentResponseDto } from '../dto/student-response.dto';

@Injectable()
export class StudentMapper {
  fromStudentToStudentResponseDto(student: Student): StudentResponseDto {
    const {
      id,
      fullName,
      email,
      career,
      collegeId,
      subjects,
      user,
      createdAt,
      updatedAt,
      deletedAt,
    } = student;

    return new StudentResponseDto({
      id,
      userId: user?.id,
      fullName,
      email,
      career,
      collegeId,
      subjects,
      createdAt,
      updatedAt,
      deletedAt,
    });
  }
}
