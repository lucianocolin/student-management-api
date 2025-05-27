import { InjectRepository } from '@nestjs/typeorm';
import { ISubjectRepository } from '../../domain/interfaces/subject-repository.interface';
import { SubjectEntity } from './subject.entity';
import { Repository } from 'typeorm';
import { Subject } from '../../domain/subject.domain';
import { SubjectAlreadyExistsException } from '../../domain/exceptions/subject-already-exists.exception';

export class SubjectRepository implements ISubjectRepository {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly repository: Repository<Subject>,
  ) {}

  async findAll(): Promise<Subject[]> {
    return this.repository.find();
  }

  async findOneByName(name: string): Promise<Subject> {
    return this.repository.findOneBy({ name });
  }

  async create(subject: Subject): Promise<Subject> {
    const subjectFound = await this.findOneByName(subject.name);

    if (subjectFound) {
      throw new SubjectAlreadyExistsException(subject.name);
    }

    const newSubject = this.repository.create(subject);

    return await this.repository.save(newSubject);
  }
}
