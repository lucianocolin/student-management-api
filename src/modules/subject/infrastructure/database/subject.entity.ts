import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SUBJECT_NAME } from '../../domain/subject.name';
import { CareerEntity } from '../../../career/infrastructure/career.entity';
import { EnrollmentEntity } from '../../../enrollment/infrastructure/database/enrollment.entity';

@Entity(SUBJECT_NAME)
export class SubjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => CareerEntity, (career) => career.subjects)
  career: CareerEntity;

  @OneToMany(() => EnrollmentEntity, (enrollment) => enrollment.subject)
  enrollments: EnrollmentEntity[];
}
