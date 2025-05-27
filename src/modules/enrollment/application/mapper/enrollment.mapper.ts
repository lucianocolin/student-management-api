import { Injectable } from '@nestjs/common';
import { Enrollment } from '../../domain/enrollment.domain';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@Injectable()
export class EnrollmentMapper {
  fromEnrollmentToEnrollmentResponseDto(
    enrollment: Enrollment,
  ): EnrollmentResponseDto {
    const {
      id,
      studentId,
      subjectId,
      grade,
      enrolledAt,
      approved,
      student,
      subject,
    } = enrollment;

    return new EnrollmentResponseDto({
      id,
      studentId,
      subjectId,
      grade,
      enrolledAt,
      approved,
      student,
      subject,
    });
  }
}
