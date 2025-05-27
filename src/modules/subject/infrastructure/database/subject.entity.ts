import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SUBJECT_NAME } from '../../domain/subject.name';
import { CareerEntity } from '../../../career/infrastructure/career.entity';
import { StudentEntity } from '../../../student/infrastructure/database/student.entity';

@Entity(SUBJECT_NAME)
export class SubjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => CareerEntity, (career) => career.subjects)
  career: CareerEntity;

  @ManyToOne(() => StudentEntity, (student) => student.subjects)
  student: StudentEntity;
}
