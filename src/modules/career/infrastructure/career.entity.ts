import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CAREER_NAME } from '../domain/career.name';
import { StudentEntity } from '../../student/infrastructure/database/student.entity';

@Entity(CAREER_NAME)
export class CareerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  name: string;

  // Add relationship with Subject

  @OneToMany(() => StudentEntity, (student) => student.career)
  student: StudentEntity;
}
