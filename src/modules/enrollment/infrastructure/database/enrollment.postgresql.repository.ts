import { InjectRepository } from '@nestjs/typeorm';
import { IEnrollmentRepository } from '../../domain/interface/enrollment-repository.interface';
import { EnrollmentEntity } from './enrollment.entity';
import { Repository } from 'typeorm';
import { Enrollment } from '../../domain/enrollment.domain';

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

  async create(enrollment: Enrollment): Promise<Enrollment> {
    return this.repository.save(enrollment);
  }
}
