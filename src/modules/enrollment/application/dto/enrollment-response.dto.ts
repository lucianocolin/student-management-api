import { Student } from 'src/modules/student/domain/student.domain';
import { Subject } from 'src/modules/subject/domain/subject.domain';

export class EnrollmentResponseDto {
  id: string;
  studentId: string;
  subjectId: string;
  grade: number | null;
  enrolledAt: Date;
  approved: boolean;
  student?: Student;
  subject?: Subject;

  constructor(data: EnrollmentResponseDto) {
    Object.assign(this, data);
  }
}
