import { InjectRepository } from '@nestjs/typeorm';
import { IEnrollmentRepository } from '../../domain/interface/enrollment-repository.interface';
import { EnrollmentEntity } from './enrollment.entity';
import { Repository } from 'typeorm';
import { Enrollment } from '../../domain/enrollment.domain';
import { EnrollmentNotFoundException } from '../../domain/exception/enrollment-not-found.exception';

export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private readonly repository: Repository<Enrollment>,
  ) {}

  async findAll(studentId?: string): Promise<Enrollment[]> {
    if (!studentId) {
      return this.repository.find();
    }

    return this.repository.find({
      where: { studentId },
      relations: ['student', 'subject'],
    });
  }

  async findOneById(id: string): Promise<Enrollment> {
    return this.repository.findOne({
      where: { id },
      relations: ['student', 'subject'],
    });
  }

  async create(enrollment: Enrollment): Promise<Enrollment> {
    return this.repository.save(enrollment);
  }

  async updateOne(
    id: string,
    enrollment: Partial<Enrollment>,
  ): Promise<Enrollment> {
    const enrollmentToUpdate = await this.findOneById(id);

    if (!enrollmentToUpdate) {
      throw new EnrollmentNotFoundException(id);
    }

    return this.repository.save({ ...enrollmentToUpdate, ...enrollment });
  }
}
