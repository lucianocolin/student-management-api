import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { STUDENT_NAME } from '../../domain/student.name';
import { UserEntity } from '../../../auth/infrastructure/database/user.entity';

@Entity(STUDENT_NAME)
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  fullName: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'int', unique: true })
  collegeId: number;

  // TODO: change to enum
  // TODO: add relation
  @Column({ type: 'text' })
  career: string;

  // TODO: change to enum
  // TODO: add relation
  @Column({ type: 'text', array: true })
  subjects: string[];

  // TODO: change to enum
  // TODO: add relation
  @Column({ type: 'float', nullable: true, array: true })
  qualifications: number[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.student)
  user: UserEntity;
}
