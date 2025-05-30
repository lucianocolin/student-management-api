import { Student } from '../student.domain';

export const STUDENT_REPOSITORY_KEY = 'STUDENT_REPOSITORY';

export interface IStudentRepository {
  getAll(): Promise<Student[]>;
  findOneById(id: string): Promise<Student>;
  findOneByEmail(email: string): Promise<Student>;
  create(student: Student): Promise<Student>;
  updateOne(studentId: string, student: Student): Promise<Student>;
  deleteOne(studentId: string): Promise<boolean>;
}
