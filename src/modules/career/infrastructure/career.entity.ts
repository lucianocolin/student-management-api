import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CAREER_NAME } from '../domain/career.name';
import { StudentEntity } from '../../student/infrastructure/database/student.entity';
import { SubjectEntity } from '../../subject/infrastructure/database/subject.entity';

@Entity(CAREER_NAME)
export class CareerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  name: string;

  @OneToMany(() => StudentEntity, (student) => student.career)
  student: StudentEntity;

  @OneToMany(() => SubjectEntity, (subject) => subject.career, {
    cascade: true,
    eager: true,
  })
  subjects: SubjectEntity[];
}
