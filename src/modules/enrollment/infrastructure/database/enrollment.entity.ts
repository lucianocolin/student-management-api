import { StudentEntity } from '../../../student/infrastructure/database/student.entity';
import { SubjectEntity } from '../../../subject/infrastructure/database/subject.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ENROLLMENT_NAME } from '../../domain/enrollment.name';

@Entity(ENROLLMENT_NAME)
export class EnrollmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column({ type: 'uuid' })
  subjectId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  grade: number | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrolledAt: Date;

  @Column({ type: 'boolean', default: false })
  approved: boolean;

  @ManyToOne(() => StudentEntity, (student) => student.enrollments)
  @JoinColumn({ name: 'studentId' })
  student: StudentEntity;

  @ManyToOne(() => SubjectEntity, (subject) => subject.enrollments)
  @JoinColumn({ name: 'subjectId' })
  subject: SubjectEntity;
}
