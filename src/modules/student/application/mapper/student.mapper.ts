import { Injectable } from '@nestjs/common';
import { Student } from '../../domain/student.domain';
import { StudentResponseDto } from '../dto/student-response.dto';

@Injectable()
export class StudentMapper {
  fromStudentToStudentResponseDto(student: Student): StudentResponseDto {
    const {
      id,
      userId,
      fullName,
      email,
      career,
      collegeId,
      subjects,
      qualifications,
      createdAt,
      updatedAt,
      deletedAt,
    } = student;

    return new StudentResponseDto({
      id,
      userId,
      fullName,
      email,
      career,
      collegeId,
      subjects,
      qualifications,
      createdAt,
      updatedAt,
      deletedAt,
    });
  }
}
