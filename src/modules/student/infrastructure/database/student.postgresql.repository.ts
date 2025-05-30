import { InjectRepository } from '@nestjs/typeorm';
import { IStudentRepository } from '../../domain/interfaces/student-repository.interface';
import { StudentEntity } from './student.entity';
import { Repository } from 'typeorm';
import { Student } from '../../domain/student.domain';
import { StudentAlreadyExistsException } from '../../domain/exceptions/student-already-exists.exception';
import { StudentNotFoundException } from '../../domain/exceptions/student-not-found.exception';

export class StudentRepository implements IStudentRepository {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repository: Repository<Student>,
  ) {}

  async getAll(): Promise<Student[]> {
    return await this.repository.find();
  }

  async findOneById(id: string): Promise<Student> {
    return await this.repository.findOne({
      where: { id },
      relations: ['career', 'user'],
    });
  }

  async findOneByEmail(email: string): Promise<Student> {
    return await this.repository.findOneBy({ email });
  }

  async create(student: Student): Promise<Student> {
    const studentExists = await this.findOneByEmail(student.email);

    if (studentExists) {
      throw new StudentAlreadyExistsException(student.email);
    }

    const studentToCreate = this.repository.create(student);

    return await this.repository.save(studentToCreate);
  }

  async updateOne(studentId: string, student: Student): Promise<Student> {
    const studentToUpdate = await this.repository.findOneBy({ id: studentId });

    if (!studentToUpdate) {
      throw new StudentNotFoundException(studentId);
    }

    return await this.repository.save({ ...studentToUpdate, ...student });
  }

  async deleteOne(studentId: string): Promise<boolean> {
    const studentToDelete = await this.findOneById(studentId);

    if (!studentToDelete) {
      throw new StudentNotFoundException(studentId);
    }

    await this.repository.softDelete({ id: studentId });

    return true;
  }
}
